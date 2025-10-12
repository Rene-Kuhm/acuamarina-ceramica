"use client";

import { useState, useEffect } from "react";

/**
 * Authentication state interface
 */
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  isLoading: boolean;
}

/**
 * Custom hook to manage authentication state
 * This is a placeholder implementation that will be replaced with real auth logic
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate auth check
    // In a real app, this would check for a valid session/token
    const checkAuth = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For now, always return unauthenticated
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Placeholder login function
    console.log("Login attempt:", email, password);
    // TODO: Implement actual login logic
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    // TODO: Clear session/tokens
  };

  return {
    ...authState,
    login,
    logout,
  };
}
