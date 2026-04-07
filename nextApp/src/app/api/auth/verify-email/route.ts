import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/emailVerification";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }

    const result = await verifyEmailToken(token);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("token") ? 400 : 500;

    console.error(err);
    return NextResponse.json({ error: message }, { status });
  }
}
