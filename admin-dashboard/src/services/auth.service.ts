import { apiClient } from '@/lib/api/client';
import { AuthResponse, LoginCredentials, User } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },
};
