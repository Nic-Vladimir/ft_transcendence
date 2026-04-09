import { randomBytes } from "crypto";
import * as bcrypt from "bcryptjs";
import { serialize } from "cookie";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  PENDING_2FA_COOKIE,
  appendPendingTwoFactorCookie,
  appendSessionCookie,
  clearCookie,
  createPendingTwoFactorToken,
  createSessionToken,
  getPendingTwoFactorExpiry,
  getSessionExpiry,
  SESSION_COOKIE,
} from "@/lib/session";

export const SOCIAL_PROVIDER_GOOGLE = "google";
const SOCIAL_STATE_COOKIE_PREFIX = "oauth_state_";

type SupportedProvider = typeof SOCIAL_PROVIDER_GOOGLE;

type GoogleTokenResponse = {
  access_token: string;
  error?: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
  given_name?: string;
  name?: string;
};

function getAppUrl(): string {
  return process.env.APP_URL?.trim() || "https://localhost:8443";
}

function getSocialStateCookieName(provider: SupportedProvider): string {
  return `${SOCIAL_STATE_COOKIE_PREFIX}${provider}`;
}

function redirectUri(provider: SupportedProvider): string {
  return `${getAppUrl().replace(/\/$/, "")}/api/auth/social/${provider}/callback`;
}

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  return { clientId, clientSecret };
}

export function isSupportedSocialProvider(provider: string): provider is SupportedProvider {
  return provider === SOCIAL_PROVIDER_GOOGLE;
}

export function createSocialState(): string {
  return randomBytes(24).toString("hex");
}

export function appendSocialStateCookie(res: NextResponse, provider: SupportedProvider, state: string) {
  res.headers.append(
    "Set-Cookie",
    serialize(getSocialStateCookieName(provider), state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    })
  );
}

export function clearSocialStateCookie(res: NextResponse, provider: SupportedProvider) {
  res.headers.append(
    "Set-Cookie",
    serialize(getSocialStateCookieName(provider), "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );
}

export function buildSocialStartUrl(provider: SupportedProvider, state: string): string {
  if (provider !== SOCIAL_PROVIDER_GOOGLE) {
    throw new Error("Unsupported social provider");
  }

  const { clientId } = getGoogleCredentials();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri(provider));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

async function exchangeGoogleCode(code: string): Promise<GoogleTokenResponse> {
  const { clientId, clientSecret } = getGoogleCredentials();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri(SOCIAL_PROVIDER_GOOGLE),
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || "Google token exchange failed");
  }

  return data as GoogleTokenResponse;
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.sub || !data.email) {
    throw new Error("Failed to fetch Google profile");
  }

  return data as GoogleUserInfo;
}

async function generateUniqueUsername(baseEmail: string, fallbackName?: string): Promise<string> {
  const preferred = (fallbackName || baseEmail.split("@")[0] || "user")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 24);

  const base = preferred || "user";
  let candidate = base;
  let suffix = 1;

  while (await prisma.users.findFirst({ where: { username: candidate } })) {
    candidate = `${base}${suffix}`;
    suffix += 1;
  }

  return candidate;
}

type SocialUserResult = {
  role: string | null;
  userId: number;
  requiresTwoFactor: boolean;
};

async function resolveGoogleUser(profile: GoogleUserInfo): Promise<SocialUserResult> {
  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_provider_user_id: {
        provider: SOCIAL_PROVIDER_GOOGLE,
        provider_user_id: profile.sub,
      },
    },
    include: {
      users: {
        include: {
          two_factor_credential: true,
        },
      },
    },
  });

  if (existingAccount) {
    return {
      userId: existingAccount.user_id,
      role: existingAccount.users.role,
      requiresTwoFactor: Boolean(existingAccount.users.two_factor_credential?.enabled_at),
    };
  }

  const existingUser = await prisma.users.findUnique({
    where: { email: profile.email.toLowerCase() },
    include: { two_factor_credential: true },
  });

  if (existingUser) {
    await prisma.oAuthAccount.create({
      data: {
        user_id: existingUser.id,
        provider: SOCIAL_PROVIDER_GOOGLE,
        provider_user_id: profile.sub,
      },
    });

    if (profile.email_verified && !existingUser.email_verified_at) {
      await prisma.users.update({
        where: { id: existingUser.id },
        data: { email_verified_at: new Date() },
      });
    }

    return {
      userId: existingUser.id,
      role: existingUser.role,
      requiresTwoFactor: Boolean(existingUser.two_factor_credential?.enabled_at),
    };
  }

  const username = await generateUniqueUsername(profile.email, profile.given_name || profile.name);
  const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 10);

  const createdUser = await prisma.users.create({
    data: {
      email: profile.email.toLowerCase(),
      username,
      password_hash: passwordHash,
      role: "user",
      email_verified_at: profile.email_verified ? new Date() : null,
      oauth_accounts: {
        create: {
          provider: SOCIAL_PROVIDER_GOOGLE,
          provider_user_id: profile.sub,
        },
      },
    },
    include: { two_factor_credential: true },
  });

  return {
    userId: createdUser.id,
    role: createdUser.role,
    requiresTwoFactor: false,
  };
}

function redirectTarget(role: string | null): string {
  return role === "admin" ? "/admin/users" : "/profile";
}

export async function finishGoogleCallback(code: string): Promise<{
  redirectTo: string;
  sessionToken: string;
  pendingTwoFactor?: boolean;
}> {
  const tokenResponse = await exchangeGoogleCode(code);
  const profile = await fetchGoogleUserInfo(tokenResponse.access_token);
  const socialUser = await resolveGoogleUser(profile);

  if (socialUser.requiresTwoFactor) {
    const pendingToken = createPendingTwoFactorToken();
    const pendingExpiresAt = getPendingTwoFactorExpiry();

    await prisma.sessions.deleteMany({
      where: {
        user_id: socialUser.userId,
        token: { startsWith: "p2fa_" },
      },
    });

    await prisma.sessions.create({
      data: {
        user_id: socialUser.userId,
        token: pendingToken,
        expires_at: pendingExpiresAt,
      },
    });

    return {
      redirectTo: `${getAppUrl().replace(/\/$/, "")}/login?twoFactor=required`,
      sessionToken: pendingToken,
      pendingTwoFactor: true,
    };
  }

  const token = createSessionToken();
  const expiresAt = getSessionExpiry();

  await prisma.sessions.create({
    data: {
      user_id: socialUser.userId,
      token,
      expires_at: expiresAt,
    },
  });

  return {
    redirectTo: `${getAppUrl().replace(/\/$/, "")}${redirectTarget(socialUser.role)}`,
    sessionToken: token,
  };
}

export function applySocialLoginCookies(
  res: NextResponse,
  provider: SupportedProvider,
  sessionToken: string,
  pendingTwoFactor = false
) {
  clearSocialStateCookie(res, provider);

  if (pendingTwoFactor) {
    clearCookie(res, SESSION_COOKIE);
    appendPendingTwoFactorCookie(res, sessionToken);
    return;
  }

  clearCookie(res, PENDING_2FA_COOKIE);
  appendSessionCookie(res, sessionToken);
}
