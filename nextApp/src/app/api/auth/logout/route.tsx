import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serialize } from "cookie";

const SESSION_COOKIE = "session";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;

    if (token) {
      // Delete session from DB
      await prisma.sessions.deleteMany({ where: { token } });
    }

    // Clear the cookie
    const res = NextResponse.json({ message: "Logged out successfully" });
    res.headers.append(
      "Set-Cookie",
      serialize(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      })
    );

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
