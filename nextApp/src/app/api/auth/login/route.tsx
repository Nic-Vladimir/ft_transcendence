import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import {
  loginUser,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/modules/auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  try {
    const body = await req.json();
    const result = await loginUser(body, ip);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Set HttpOnly cookie
    const res = NextResponse.json(result.data.body);
    res.headers.append(
      "Set-Cookie",
      serialize(SESSION_COOKIE, result.data.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
      })
    );

    return res;

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
