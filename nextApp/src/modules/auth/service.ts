import { NextRequest, NextResponse } from "next/server";
import type { Users } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import type {
  AuthUserDto,
  LoginRequest,
  LoginSuccessResponse,
  LogoutSuccessResponse,
  RegisterRequest,
  RegisterSuccessResponse,
  UserRole,
} from "@contracts/auth";
import { prisma } from "@/lib/prisma";
import { checkLoginRateLimit, clearLoginRateLimit } from "@/lib/rateLimit";

type AuthSuccess = {
  user: Users;
  response: null;
};

type AuthFailure = {
  user: null;
  response: NextResponse;
};

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export const SESSION_COOKIE = "session";
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

function normalizeRole(role: string | null): UserRole | null {
  return role === "admin" || role === "user" ? role : null;
}

function toAuthUserDto(user: {
  id: number;
  username: string | null;
  email: string;
  role: string | null;
  created_at: Date | null;
}): AuthUserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: normalizeRole(user.role),
    created_at: user.created_at?.toISOString() ?? null,
  };
}

export async function requireAuth(req: NextRequest): Promise<AuthSuccess | AuthFailure> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return {
      user: null,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  const session = await prisma.sessions.findFirst({
    where: {
      token,
      expires_at: { gt: new Date() },
    },
    include: { users: true },
  });

  if (!session) {
    return {
      user: null,
      response: NextResponse.json({ error: "Invalid or expired session" }, { status: 401 }),
    };
  }

  return { user: session.users, response: null };
}

export async function registerUser(
  payload: Partial<RegisterRequest>,
  missingFieldsMessage = "username, email and password are required"
): Promise<ServiceResult<RegisterSuccessResponse>> {
  const { username, email, password } = payload;

  if (!username || !email || !password) {
    return { ok: false, status: 400, error: missingFieldsMessage };
  }

  const exists = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (exists) {
    return { ok: false, status: 409, error: "User already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password_hash: passwordHash,
      role: "user",
    },
  });

  return {
    ok: true,
    data: toAuthUserDto(user),
  };
}

export async function loginUser(
  payload: Partial<LoginRequest>,
  ip: string
): Promise<ServiceResult<{ body: LoginSuccessResponse; sessionToken: string }>> {
  const { email, password } = payload;

  if (!email || !password) {
    return { ok: false, status: 400, error: "email and password are required" };
  }

  if (!checkLoginRateLimit(ip, email)) {
    return {
      ok: false,
      status: 429,
      error: "Too many login attempts. Try again later.",
    };
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, status: 401, error: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { ok: false, status: 401, error: "Invalid credentials" };
  }

  clearLoginRateLimit(ip, email);

  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.sessions.create({
    data: { user_id: user.id, token: sessionToken, expires_at: expiresAt },
  });

  return {
    ok: true,
    data: {
      body: { id: user.id },
      sessionToken,
    },
  };
}

export async function logoutUser(token?: string): Promise<LogoutSuccessResponse> {
  if (token) {
    await prisma.sessions.deleteMany({ where: { token } });
  }

  return { message: "Logged out successfully" };
}
