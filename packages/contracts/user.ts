import type { ApiErrorResponse, AuthUserDto, UserRole } from "./auth";

export interface UpdateUserRequest {
  username: string;
  email: string;
}

export interface UpdateUserResponse {
  id: number;
  username: string | null;
  email: string;
  role: UserRole | null;
}

export type DeleteUserResponse = void;

export type ListUsersResponse = AuthUserDto[] | ApiErrorResponse;
