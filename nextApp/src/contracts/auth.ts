export type AuthUser = {
  id: number;
  username?: string | null;
  email?: string | null;
  role?: string | null;
  created_at?: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id?: number;
  error?: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  id?: number;
  username?: string | null;
  email?: string | null;
  role?: string | null;
  created_at?: string | null;
  error?: string;
};

export type CurrentUserResponse = AuthUser | { error: string };

export type LogoutResponse = {
  message?: string;
  error?: string;
};