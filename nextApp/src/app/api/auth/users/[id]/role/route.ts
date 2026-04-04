import { NextRequest, NextResponse } from "next/server";
import { requireAuth, updateUserRole } from "@/modules/auth";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  const { id } = await context.params;

  try {
    const body = await req.json();
    const result = await updateUserRole(auth.user, id, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
