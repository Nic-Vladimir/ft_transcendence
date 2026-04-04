import * as bcrypt from "bcryptjs";
import type { RegisterRequest, RegisterSuccessResponse } from "@contracts/auth";
import { prisma } from "@/lib/prisma";
import { toAuthUserDto } from "./roles";
import type { ServiceResult } from "./types";

export async function registerUser(
  payload: Partial<RegisterRequest>,
  missingFieldsMessage = "username, email and password are required"
): Promise<ServiceResult<RegisterSuccessResponse>> {
  const { username, email, password } = payload;

  if (!username || !email || !password) {
    return { ok: false, status: 400, error: missingFieldsMessage };
  }

  const exists = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (exists) {
    return { ok: false, status: 409, error: "User already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password_hash: passwordHash,
      role: "user",
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  return {
    ok: true,
    data: toAuthUserDto(user),
  };
}
