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

    return apiClient.get<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`);
  },

  getById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  create: async (data: CreateProductDTO): Promise<Product> => {
    return apiClient.post<Product>('/products', data);
  },

  update: async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },

  toggleActive: async (id: string): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}/toggle-active`);
  },
};
