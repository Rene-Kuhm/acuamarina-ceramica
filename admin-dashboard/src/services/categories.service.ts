import { apiClient } from '@/lib/api/client';
import { Category } from '@/types';

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// API Response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const categoriesService = {
  getAll: async (activeOnly: boolean = false): Promise<Category[]> => {
    const params = activeOnly ? '?activeOnly=true' : '';
    const response = await apiClient.get<ApiResponse<Category[]>>(`/categories${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCategoryDTO>): Promise<Category> => {
    const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/categories/${id}`);
  },
};
