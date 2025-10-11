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

export const categoriesService = {
  getAll: async (activeOnly: boolean = false): Promise<Category[]> => {
    const params = activeOnly ? '?activeOnly=true' : '';
    return apiClient.get<Category[]>(`/categories${params}`);
  },

  getById: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    return apiClient.post<Category>('/categories', data);
  },

  update: async (id: string, data: Partial<CreateCategoryDTO>): Promise<Category> => {
    return apiClient.patch<Category>(`/categories/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/categories/${id}`);
  },
};
