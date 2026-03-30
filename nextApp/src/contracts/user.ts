import { useState } from "react";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
} from "@/contracts/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (
    email: LoginRequest["email"],
    password: LoginRequest["password"]
  ) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password } satisfies LoginRequest),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Login failed");
        return false;
      }

      if (typeof data.id !== "number") {
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
        setErrorMessage(data.error || "Registration failed");
        return false;
      }

      if (typeof data.id !== "number") {
        setErrorMessage("Invalid registration response");
        return false;
      }

      setUser({
        id: data.id,
        username: data.username ?? null,
        email: data.email ?? null,
        role: data.role ?? null,
        created_at: data.created_at ?? null,
      });

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
        setErrorMessage(data.error || "Logout failed");
        return false;
      }

      setUser(null);
      setSuccessMessage(data.message || "Logged out");
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