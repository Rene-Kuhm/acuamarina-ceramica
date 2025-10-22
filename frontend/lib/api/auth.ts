import { apiClient } from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string; // deprecated - use firstName/lastName
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);

    // El backend devuelve { success: true, data: { user, accessToken, refreshToken } }
    // Pero necesitamos { user, token }
    if (response.data.success && response.data.data) {
      return {
        user: {
          ...response.data.data.user,
          name: `${response.data.data.user.firstName} ${response.data.data.user.lastName}`,
        },
        token: response.data.data.accessToken,
      };
    }

    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Si se proporciona 'name', dividirlo en firstName y lastName
    let requestData = { ...data };

    if (data.name && !data.firstName && !data.lastName) {
      const nameParts = data.name.trim().split(/\s+/);
      requestData.firstName = nameParts[0];
      requestData.lastName = nameParts.slice(1).join(' ') || nameParts[0];
      delete requestData.name;
    }

    const response = await apiClient.post("/auth/register", requestData);

    // El backend devuelve { success: true, data: { user, accessToken, refreshToken } }
    // Pero necesitamos { user, token }
    if (response.data.success && response.data.data) {
      return {
        user: {
          ...response.data.data.user,
          name: `${response.data.data.user.firstName} ${response.data.data.user.lastName}`,
        },
        token: response.data.data.accessToken,
      };
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");

    // El backend devuelve { success: true, data: { user } }
    if (response.data.success && response.data.data) {
      return {
        ...response.data.data.user,
        name: `${response.data.data.user.firstName} ${response.data.data.user.lastName}`,
      };
    }

    return response.data;
  },
};
