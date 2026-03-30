import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/modules/auth";
import { getCurrentUserProfile } from "@/modules/user";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth.response) return auth.response;
    const result = await getCurrentUserProfile(auth.user.id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
