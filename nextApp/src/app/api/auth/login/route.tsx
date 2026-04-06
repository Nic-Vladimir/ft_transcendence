import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { serialize } from "cookie";

// ----------------- Rate limiter -----------------
type RateEntry = { count: number; resetAt: number };
const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, RateEntry>();

function checkRateLimit(ip: string, email: string): boolean {
  const key = `${ip}:${email}`;
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) return false;

  entry.count++;
  return true;
}

function clearRateLimit(ip: string, email: string) {
  attempts.delete(`${ip}:${email}`);
}

// ----------------- Session constants -----------------
const SESSION_COOKIE = "session";
const SESSION_TTL_DAYS = 7;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  try {
    const { email, password } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    // Rate limiting
    if (!checkRateLimit(ip, normalizedEmail)) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    // Find user
    const user = await prisma.users.findUnique({ where: { email: normalizedEmail } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Check password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    if (user.role !== "admin" && !user.email_verified_at) {
      return NextResponse.json(
        {
          code: "EMAIL_NOT_VERIFIED",
          email: user.email,
          error: "Please verify your email first.",
        },
        { status: 403 }
      );
    }

    // Clear rate limit on success
    clearRateLimit(ip, normalizedEmail);

    // Create session
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await prisma.sessions.create({
      data: { user_id: user.id, token, expires_at: expiresAt },
    });

    // Set HttpOnly cookie
    const res = NextResponse.json({ id: user.id });
    res.headers.append(
      "Set-Cookie",
      serialize(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
      })
    );

    return res;

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
