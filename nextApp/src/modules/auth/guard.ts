import type { Users } from "@prisma/client";
import type { UserRole } from "@contracts/auth";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "./cookies";
import { normalizeRole } from "./roles";
import { getSessionUser } from "./session";
import type { AuthFailure, AuthSuccess } from "./types";

export async function requireAuth(req: NextRequest): Promise<AuthSuccess | AuthFailure> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return {
      user: null,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  const user = await getSessionUser(token);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
}

export function hasRequiredRole(
  user: Pick<Users, "role">,
  role: UserRole
): boolean {
  return normalizeRole(user.role) === role;
}

export function requireRole(
  user: Pick<Users, "role">,
  role: UserRole
): NextResponse | null {
  if (hasRequiredRole(user, role)) {
    return null;
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
