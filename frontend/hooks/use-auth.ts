"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchApi("/Auth/me");
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: any) => {
    const data: AuthResponse = await fetchApi("/Auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    localStorage.setItem("token", data.token);
    await fetchUser();
    router.push("/");
  };

  const registerRenter = async (data: any) => {
    const response: AuthResponse = await fetchApi("/Auth/register/renter", {
      method: "POST",
      body: JSON.stringify(data),
    });

    localStorage.setItem("token", response.token);
    await fetchUser();
    router.push("/");
  };

  const registerStore = async (data: any) => {
    const response: AuthResponse = await fetchApi("/Auth/register/store", {
      method: "POST",
      body: JSON.stringify(data),
    });

    localStorage.setItem("token", response.token);
    await fetchUser();
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    loading,
    login,
    registerRenter,
    registerStore,
    logout,
  };
}
