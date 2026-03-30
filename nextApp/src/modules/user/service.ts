import type { Users } from "@prisma/client";
import type { AuthUserDto, UserRole } from "@contracts/auth";
import type { UpdateUserRequest, UpdateUserResponse } from "@contracts/user";
import { prisma } from "@/lib/prisma";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

function normalizeRole(role: string | null): UserRole | null {
  return role === "admin" || role === "user" ? role : null;
}

function toAuthUserDto(user: {
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

function toUpdateUserResponse(user: {
  id: number;
  username: string | null;
  email: string;
  role: string | null;
}): UpdateUserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: normalizeRole(user.role),
  };
}

function resolveTargetUserId(authUser: Users, id: string): ServiceResult<number> {
  if (id === "me") {
    return { ok: true, data: authUser.id };
  }

  const targetUserId = Number(id);
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    return { ok: false, status: 400, error: "Invalid user id" };
  }

  if (authUser.role !== "admin") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, data: targetUserId };
}

export async function getCurrentUserProfile(userId: number): Promise<ServiceResult<AuthUserDto>> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  if (!user) {
    return { ok: false, status: 404, error: "User not found" };
  }

  return { ok: true, data: toAuthUserDto(user) };
}

export async function listUsers(authUser: Users): Promise<ServiceResult<AuthUserDto[]>> {
  if (authUser.role !== "admin") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: { id: "asc" },
  });

  return { ok: true, data: users.map(toAuthUserDto) };
}

export async function updateUser(
  authUser: Users,
  id: string,
  payload: Partial<UpdateUserRequest>
): Promise<ServiceResult<UpdateUserResponse>> {
  const target = resolveTargetUserId(authUser, id);
  if (!target.ok) return target;

  const { username, email, role } = payload;
  if (!username || !email) {
    return { ok: false, status: 400, error: "username and email are required" };
  }

  const existingUser = await prisma.users.findUnique({
    where: { id: target.data },
  });
  if (!existingUser) {
    return { ok: false, status: 404, error: "User not found" };
  }

  const duplicate = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email }],
      NOT: { id: target.data },
    },
  });
  if (duplicate) {
    return { ok: false, status: 409, error: "Email or username already in use" };
  }

  const data: Partial<{ username: string; email: string; role?: string }> = {
    username,
    email,
  };
  if (authUser.role === "admin" && role !== undefined) {
    data.role = role;
  }

  const updatedUser = await prisma.users.update({
    where: { id: target.data },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return { ok: true, data: toUpdateUserResponse(updatedUser) };
}

export async function deleteUser(
  authUser: Users,
  id: string
): Promise<ServiceResult<null>> {
  const target = resolveTargetUserId(authUser, id);
  if (!target.ok) return target;

  const existingUser = await prisma.users.findUnique({
    where: { id: target.data },
  });
  if (!existingUser) {
    return { ok: false, status: 404, error: "User not found" };
  }

  await prisma.users.delete({ where: { id: target.data } });
  return { ok: true, data: null };
}
