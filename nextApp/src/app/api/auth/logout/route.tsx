import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, logoutUser, SESSION_COOKIE } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const result = await logoutUser(token);

    const res = NextResponse.json(result);
    res.headers.append("Set-Cookie", clearSessionCookie());

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
