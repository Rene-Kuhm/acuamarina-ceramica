import { apiClient } from '@/lib/api/client';
import { AuthResponse, LoginCredentials, User } from '@/types';

// Tipo de respuesta del backend que envuelve todo en { success, data }
interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<BackendResponse<AuthResponse>>('/auth/login', credentials);
    console.log('📡 Respuesta del backend:', response);
    // Extraer data.data porque el backend envuelve en { success, data }
    return response.data;
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<BackendResponse<{ user: User }>>('/auth/me');
    return response.data.user;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<BackendResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
    // refresh solo devuelve accessToken, mantener el resto
    return {
      accessToken: response.data.accessToken,
    } as AuthResponse;
  },
};
