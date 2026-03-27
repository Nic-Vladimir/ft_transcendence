import { useState } from "react";

type User = {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  created_at?: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Login failed");
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

  const register = async (payload: { username: string; email: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed");
        return false;
      }

      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        created_at: data.created_at,
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

  const logout = () => {
    setUser(null);
    setSuccessMessage("Logged out");
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