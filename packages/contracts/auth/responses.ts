import type {
  ApiErrorResponse,
  AuthUserDto,
  MessageResponse,
  UserRole,
} from "./models";

export type RegisterSuccessResponse = AuthUserDto;
export type RegisterResponse = RegisterSuccessResponse | ApiErrorResponse;

export interface LoginSuccessResponse {
  id: number;
}

export type LoginResponse = LoginSuccessResponse | ApiErrorResponse;

export type MeResponse = AuthUserDto | ApiErrorResponse;

export interface LogoutSuccessResponse extends MessageResponse {}
export type LogoutResponse = LogoutSuccessResponse | ApiErrorResponse;

export interface VerifyEmailSuccessResponse extends MessageResponse {}
export type VerifyEmailResponse = VerifyEmailSuccessResponse | ApiErrorResponse;

export interface ResendVerificationSuccessResponse extends MessageResponse {}
export type ResendVerificationResponse =
  | ResendVerificationSuccessResponse
  | ApiErrorResponse;

export interface ForgotPasswordSuccessResponse extends MessageResponse {}
export type ForgotPasswordResponse =
  | ForgotPasswordSuccessResponse
  | ApiErrorResponse;

export interface ResetPasswordSuccessResponse extends MessageResponse {}
export type ResetPasswordResponse = ResetPasswordSuccessResponse | ApiErrorResponse;

export interface SocialAuthStartResponse extends MessageResponse {
  provider: string;
}

export type SocialAuthStartApiResponse =
  | SocialAuthStartResponse
  | ApiErrorResponse;

export interface SocialAuthCallbackResponse extends MessageResponse {
  provider: string;
}

export type SocialAuthCallbackApiResponse =
  | SocialAuthCallbackResponse
  | ApiErrorResponse;

export interface TwoFactorSetupResponse extends MessageResponse {
  secret: string | null;
  otpauth_url: string | null;
}

export type TwoFactorSetupApiResponse =
  | TwoFactorSetupResponse
  | ApiErrorResponse;

export interface TwoFactorEnableResponse extends MessageResponse {}
export type TwoFactorEnableApiResponse =
  | TwoFactorEnableResponse
  | ApiErrorResponse;

export interface TwoFactorVerifyResponse extends MessageResponse {}
export type TwoFactorVerifyApiResponse =
  | TwoFactorVerifyResponse
  | ApiErrorResponse;

export interface TwoFactorDisableResponse extends MessageResponse {}
export type TwoFactorDisableApiResponse =
  | TwoFactorDisableResponse
  | ApiErrorResponse;

export type RolesResponse = UserRole[] | ApiErrorResponse;

export type UpdateUserRoleResponse = AuthUserDto | ApiErrorResponse;
