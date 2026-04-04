import type {
  SocialAuthCallbackResponse,
  SocialAuthStartResponse,
} from "@contracts/auth";
import type { ServiceResult } from "./types";
import { notImplemented } from "./types";

function validateProvider(provider: string): ServiceResult<string> {
  if (!provider) {
    return { ok: false, status: 400, error: "provider is required" };
  }

  return { ok: true, data: provider };
}

export async function startSocialLogin(
  provider: string
): Promise<ServiceResult<SocialAuthStartResponse>> {
  const validated = validateProvider(provider);
  if (!validated.ok) {
    return validated;
  }

  return notImplemented(
    `Social login start for provider "${validated.data}" is not implemented yet`
  );
}

export async function handleSocialLoginCallback(
  provider: string
): Promise<ServiceResult<SocialAuthCallbackResponse>> {
  const validated = validateProvider(provider);
  if (!validated.ok) {
    return validated;
  }

  return notImplemented(
    `Social login callback for provider "${validated.data}" is not implemented yet`
  );
}
