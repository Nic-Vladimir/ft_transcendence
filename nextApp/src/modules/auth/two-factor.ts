import type { Users } from "@prisma/client";
import type {
  TwoFactorDisableRequest,
  TwoFactorDisableResponse,
  TwoFactorEnableRequest,
  TwoFactorEnableResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
} from "@contracts/auth";
import type { ServiceResult } from "./types";
import { notImplemented } from "./types";

export async function setupTwoFactor(
  _authUser: Users
): Promise<ServiceResult<TwoFactorSetupResponse>> {
  return notImplemented("2FA setup is not implemented yet");
}

export async function enableTwoFactor(
  _authUser: Users,
  payload: Partial<TwoFactorEnableRequest>
): Promise<ServiceResult<TwoFactorEnableResponse>> {
  if (!payload.code) {
    return { ok: false, status: 400, error: "code is required" };
  }

  return notImplemented("2FA enable is not implemented yet");
}

export async function verifyTwoFactor(
  payload: Partial<TwoFactorVerifyRequest>
): Promise<ServiceResult<TwoFactorVerifyResponse>> {
  if (!payload.code) {
    return { ok: false, status: 400, error: "code is required" };
  }

  return notImplemented("2FA verification is not implemented yet");
}

export async function disableTwoFactor(
  _authUser: Users,
  payload: Partial<TwoFactorDisableRequest>
): Promise<ServiceResult<TwoFactorDisableResponse>> {
  if (!payload.password && !payload.code) {
    return {
      ok: false,
      status: 400,
      error: "password or code is required",
    };
  }

  return notImplemented("2FA disable is not implemented yet");
}
