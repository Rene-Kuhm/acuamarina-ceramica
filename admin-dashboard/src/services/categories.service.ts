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

// Backend Category type (snake_case from PostgreSQL)
interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  parent_name?: string | null;
  image?: string | null;
  display_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  products_count?: string;
}

// Transform backend response (snake_case) to frontend format (camelCase)
const transformCategory = (backendCategory: BackendCategory): Category => ({
  id: backendCategory.id,
  name: backendCategory.name,
  slug: backendCategory.slug,
  description: backendCategory.description,
  parentId: backendCategory.parent_id || undefined,
  imageUrl: backendCategory.image || undefined,
  displayOrder: backendCategory.display_order,
  isActive: backendCategory.is_active,
  metaTitle: backendCategory.meta_title,
  metaDescription: backendCategory.meta_description,
  createdAt: backendCategory.created_at,
  updatedAt: backendCategory.updated_at,
});

export const categoriesService = {
  getAll: async (activeOnly: boolean = false): Promise<Category[]> => {
    const params = activeOnly ? '?activeOnly=true' : '';
    const response = await apiClient.get<ApiResponse<BackendCategory[]>>(`/categories${params}`);
    return response.data.map(transformCategory);
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<BackendCategory>>(`/categories/${id}`);
    return transformCategory(response.data);
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    // Backend espera camelCase y convierte automáticamente a snake_case
    const response = await apiClient.post<ApiResponse<BackendCategory>>('/categories', data);
    return transformCategory(response.data);
  },

  update: async (id: string, data: Partial<CreateCategoryDTO>): Promise<Category> => {
    // Backend espera camelCase y convierte automáticamente a snake_case
    const response = await apiClient.patch<ApiResponse<BackendCategory>>(`/categories/${id}`, data);
    return transformCategory(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/categories/${id}`);
  },
};
