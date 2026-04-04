import { NextRequest, NextResponse } from "next/server";
import { startSocialLogin } from "@/modules/auth";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ provider: string }> }
): Promise<NextResponse> {
  const { provider } = await context.params;

  try {
    const result = await startSocialLogin(provider);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
