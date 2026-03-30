export type UserRole = "admin" | "user";

export interface ApiErrorResponse {
  error: string;
}

export interface AuthUserDto {
  id: number;
  username: string | null;
  email: string;
  role: UserRole | null;
  created_at: string | null;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export type RegisterSuccessResponse = AuthUserDto;
export type RegisterResponse = RegisterSuccessResponse | ApiErrorResponse;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  id: number;
}

export type LoginResponse = LoginSuccessResponse | ApiErrorResponse;

export type MeResponse = AuthUserDto | ApiErrorResponse;

export interface LogoutSuccessResponse {
  message: string;
}

export type LogoutResponse = LogoutSuccessResponse | ApiErrorResponse;
