import type { Users } from "@prisma/client";
import type { NextResponse } from "next/server";

export type AuthSuccess = {
  user: Users;
  response: null;
};

export type AuthFailure = {
  user: null;
  response: NextResponse;
};

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export function notImplemented(error: string): ServiceResult<never> {
  return {
    ok: false,
    status: 501,
    error,
  };
}
