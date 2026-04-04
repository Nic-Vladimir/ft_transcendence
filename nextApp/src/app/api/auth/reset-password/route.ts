import { NextRequest, NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await resetPasswordWithToken(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
