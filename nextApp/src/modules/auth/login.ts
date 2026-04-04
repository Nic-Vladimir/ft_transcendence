import * as bcrypt from "bcryptjs";
import type { LoginRequest, LoginSuccessResponse } from "@contracts/auth";
import { prisma } from "@/lib/prisma";
import { checkLoginRateLimit, clearLoginRateLimit } from "@/lib/rateLimit";
import { createSession } from "./session";
import type { ServiceResult } from "./types";

export async function loginUser(
  payload: Partial<LoginRequest>,
  ip: string
): Promise<ServiceResult<{ body: LoginSuccessResponse; sessionToken: string }>> {
  const { email, password } = payload;

  if (!email || !password) {
    return { ok: false, status: 400, error: "email and password are required" };
  }

  if (!checkLoginRateLimit(ip, email)) {
    return {
      ok: false,
      status: 429,
      error: "Too many login attempts. Try again later.",
    };
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, status: 401, error: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { ok: false, status: 401, error: "Invalid credentials" };
  }

  clearLoginRateLimit(ip, email);

  const { sessionToken } = await createSession(user.id);

  return {
    ok: true,
    data: {
      body: { id: user.id },
      sessionToken,
    },
  };
}
