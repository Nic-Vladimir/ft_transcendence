'use server'
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/modules/auth";
import { deleteUser, updateUser } from "@/modules/user";

// PUT — update user
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    const result = await updateUser(auth.user, id, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete user
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const result = await deleteUser(auth.user, id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
