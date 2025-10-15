import { apiClient } from '@/lib/api/client';
import { Product, CreateProductDTO, PaginatedResponse } from '@/types';

export const productsService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.search) queryParams.append('search', params.search);

    // El backend retorna { success, data, pagination }
    // Necesitamos transformarlo a { data, page, limit, total, totalPages }
    const response = await apiClient.get<{
      success: boolean;
      data: Product[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/products?${queryParams.toString()}`);

    return {
      data: response.data,
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      totalPages: response.pagination.totalPages,
    };
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDTO): Promise<Product> => {
    const response = await apiClient.post<{ success: boolean; data: Product }>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
    const response = await apiClient.patch<{ success: boolean; data: Product }>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },

  toggleActive: async (id: string): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}/toggle-active`);
  },
};
