import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/modules/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await registerUser(
      body,
      "username, email, and password are required"
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
