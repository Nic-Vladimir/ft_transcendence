import type {
  ResendVerificationRequest,
  ResendVerificationSuccessResponse,
  VerifyEmailSuccessResponse,
} from "@contracts/auth";
import type { ServiceResult } from "./types";
import { notImplemented } from "./types";

export async function verifyEmailToken(
  token?: string | null
): Promise<ServiceResult<VerifyEmailSuccessResponse>> {
  if (!token) {
    return { ok: false, status: 400, error: "token is required" };
  }

  return notImplemented("Email verification is not implemented yet");
}

export async function resendVerificationEmail(
  payload: Partial<ResendVerificationRequest>
): Promise<ServiceResult<ResendVerificationSuccessResponse>> {
  if (payload.email !== undefined && payload.email.trim() === "") {
    return { ok: false, status: 400, error: "email cannot be empty" };
  }

  return {
    ok: true,
    data: {
      message: "If the account exists, a verification email will be sent.",
    },
  };
}
