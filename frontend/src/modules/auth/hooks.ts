import { useState } from "react";
import type {
  ApiErrorResponse,
  AuthUserDto,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from "@contracts/auth";

type AuthClientUser = Pick<AuthUserDto, "id"> & Partial<Omit<AuthUserDto, "id">>;

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null && "error" in value;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<AuthClientUser | null>(null);

  const login = async (
    email: LoginRequest["email"],
    password: LoginRequest["password"]
  ) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: LoginRequest = { email, password };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setErrorMessage(isApiErrorResponse(data) ? data.error : "Login failed");
        return false;
      }

      if (!("id" in data) || typeof data.id !== "number") {
        setErrorMessage("Invalid login response");
        return false;
      }

      setUser({ id: data.id });
      setSuccessMessage("Login successful");
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) {
        setErrorMessage(isApiErrorResponse(data) ? data.error : "Registration failed");
        return false;
      }

      if (!("id" in data) || typeof data.id !== "number") {
        setErrorMessage("Invalid registration response");
        return false;
      }

      setUser(data);
      setSuccessMessage("User created");
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data: LogoutResponse = await res.json();

      if (!res.ok) {
        setErrorMessage(isApiErrorResponse(data) ? data.error : "Logout failed");
        return false;
      }

      setUser(null);
      setSuccessMessage("message" in data ? data.message : "Logged out");
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || "Logout failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
    login,
    logout,
    register,
  };
}
