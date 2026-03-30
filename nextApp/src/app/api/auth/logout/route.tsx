import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { logoutUser, SESSION_COOKIE } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const result = await logoutUser(token);

    // Clear the cookie
    const res = NextResponse.json(result);
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
