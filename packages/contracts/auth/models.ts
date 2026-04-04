export type UserRole = "admin" | "user";

export interface ApiErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

export interface AuthUserDto {
  id: number;
  username: string | null;
  email: string;
  role: UserRole | null;
  created_at: string | null;
}
