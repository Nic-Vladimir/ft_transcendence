import { randomBytes } from "crypto";
import type { Users } from "@prisma/client";
import type { LogoutSuccessResponse } from "@contracts/auth";
import { prisma } from "@/lib/prisma";
import { SESSION_TTL_SECONDS } from "./cookies";

export async function createSession(userId: number): Promise<{
  expiresAt: Date;
  sessionToken: string;
}> {
  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.sessions.create({
    data: { user_id: userId, token: sessionToken, expires_at: expiresAt },
  });

  return { expiresAt, sessionToken };
}

export async function getSessionUser(token?: string): Promise<Users | null> {
  if (!token) {
    return null;
  }

  const session = await prisma.sessions.findFirst({
    where: {
      token,
      expires_at: { gt: new Date() },
    },
    include: { users: true },
  });

  return session?.users ?? null;
}

export async function revokeSession(token?: string): Promise<void> {
  if (!token) {
    return;
  }

  await prisma.sessions.deleteMany({ where: { token } });
}

export async function logoutUser(token?: string): Promise<LogoutSuccessResponse> {
  await revokeSession(token);

  return { message: "Logged out successfully" };
}
