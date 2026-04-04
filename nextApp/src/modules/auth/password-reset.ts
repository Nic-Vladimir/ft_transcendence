import type {
  ForgotPasswordRequest,
  ForgotPasswordSuccessResponse,
  ResetPasswordRequest,
  ResetPasswordSuccessResponse,
} from "@contracts/auth";
import type { ServiceResult } from "./types";
import { notImplemented } from "./types";

export async function createPasswordResetRequest(
  payload: Partial<ForgotPasswordRequest>
): Promise<ServiceResult<ForgotPasswordSuccessResponse>> {
  if (!payload.email) {
    return { ok: false, status: 400, error: "email is required" };
  }

  return {
    ok: true,
    data: {
      message: "If the account exists, a reset email will be sent.",
    },
  };
}

export async function resetPasswordWithToken(
  payload: Partial<ResetPasswordRequest>
): Promise<ServiceResult<ResetPasswordSuccessResponse>> {
  if (!payload.token || !payload.password) {
    return { ok: false, status: 400, error: "token and password are required" };
  }

  return notImplemented("Password reset is not implemented yet");
}
