import type { UserRole } from "./models";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResendVerificationRequest {
  email?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface TwoFactorEnableRequest {
  code: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorDisableRequest {
  password?: string;
  code?: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}
