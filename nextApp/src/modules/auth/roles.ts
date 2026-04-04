import type { Users } from "@prisma/client";
import type {
  AuthUserDto,
  UpdateUserRoleRequest,
  UserRole,
} from "@contracts/auth";
import { prisma } from "@/lib/prisma";
import type { ServiceResult } from "./types";

export const SUPPORTED_ROLES: UserRole[] = ["admin", "user"];

export function isSupportedRole(role: unknown): role is UserRole {
  return role === "admin" || role === "user";
}

export function normalizeRole(role: string | null): UserRole | null {
  return isSupportedRole(role) ? role : null;
}

export function toAuthUserDto(user: {
  id: number;
  username: string | null;
  email: string;
  role: string | null;
  created_at: Date | null;
}): AuthUserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: normalizeRole(user.role),
    created_at: user.created_at?.toISOString() ?? null,
  };
}

function parseTargetUserId(id: string): ServiceResult<number> {
  const targetUserId = Number(id);

  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    return { ok: false, status: 400, error: "Invalid user id" };
  }

  return { ok: true, data: targetUserId };
}

export async function listSupportedRoles(
  authUser: Users
): Promise<ServiceResult<UserRole[]>> {
  if (normalizeRole(authUser.role) !== "admin") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, data: SUPPORTED_ROLES };
}

export async function updateUserRole(
  authUser: Users,
  id: string,
  payload: Partial<UpdateUserRoleRequest>
): Promise<ServiceResult<AuthUserDto>> {
  if (normalizeRole(authUser.role) !== "admin") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  const target = parseTargetUserId(id);
  if (!target.ok) {
    return target;
  }

  if (!isSupportedRole(payload.role)) {
    return { ok: false, status: 400, error: "Invalid role" };
  }

  const existingUser = await prisma.users.findUnique({
    where: { id: target.data },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  if (!existingUser) {
    return { ok: false, status: 404, error: "User not found" };
  }

  const updatedUser = await prisma.users.update({
    where: { id: target.data },
    data: { role: payload.role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  return { ok: true, data: toAuthUserDto(updatedUser) };
}
