"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, type User } from "@/lib/api/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return;
    }

    try {
      const user = await authApi.getProfile();
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem(TOKEN_KEY, response.token);
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión"
      };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await authApi.register({ name, email, password, phone });
      localStorage.setItem(TOKEN_KEY, response.token);
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrarse"
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      router.push("/");
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    checkAuth,
  };
}
