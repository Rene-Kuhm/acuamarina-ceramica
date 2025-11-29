import { apiClient } from '@/lib/api/client';
import { User } from '@/types';

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export const userService = {
  updatePassword: async (payload: UpdatePasswordPayload): Promise<UserResponse> => {
    return apiClient.put<UserResponse>('/users/password', payload);
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<UserResponse> => {
    return apiClient.put<UserResponse>('/users/profile', payload);
  },

  getProfile: async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>('/users/profile');
  },
};
