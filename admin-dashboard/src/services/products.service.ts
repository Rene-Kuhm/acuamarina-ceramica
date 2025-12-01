import { apiClient } from '@/lib/api/client';
import { Product, CreateProductDTO, PaginatedResponse } from '@/types';

// Backend Product interface (snake_case)
interface BackendProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  dimensions?: string;
  weight?: number;
  material?: string;
  finish?: string;
  color?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  is_active: boolean;
  is_featured: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  views_count: number;
  sales_count: number;
  images?: string[];
  created_at: string;
  updated_at: string;
}

// Transform backend (snake_case) to frontend (camelCase)
const transformProduct = (backend: BackendProduct): Product => ({
  id: backend.id,
  sku: backend.sku,
  name: backend.name,
  slug: backend.slug,
  description: backend.description,
  shortDescription: backend.short_description,
  categoryId: backend.category_id,
  categoryName: backend.category_name,
  categorySlug: backend.category_slug,
  price: backend.price,
  comparePrice: backend.compare_price,
  costPrice: backend.cost_price,
  dimensions: backend.dimensions,
  weight: backend.weight,
  material: backend.material,
  finish: backend.finish,
  color: backend.color,
  metaTitle: backend.meta_title,
  metaDescription: backend.meta_description,
  keywords: backend.keywords,
  isActive: backend.is_active,
  isFeatured: backend.is_featured,
  stockQuantity: backend.stock_quantity,
  lowStockThreshold: backend.low_stock_threshold,
  viewsCount: backend.views_count,
  salesCount: backend.sales_count,
  images: backend.images,
  createdAt: backend.created_at,
  updatedAt: backend.updated_at,
});

// Transform frontend DTO (camelCase) to backend (snake_case)
const transformToBackend = (dto: Partial<CreateProductDTO>): any => {
  const backendData: any = {};

  if (dto.sku !== undefined) backendData.sku = dto.sku;
  if (dto.name !== undefined) backendData.name = dto.name;
  if (dto.slug !== undefined) backendData.slug = dto.slug;
  if (dto.description !== undefined) backendData.description = dto.description;
  if (dto.shortDescription !== undefined) backendData.short_description = dto.shortDescription;
  if (dto.categoryId !== undefined) backendData.category_id = dto.categoryId;
  if (dto.price !== undefined) backendData.price = dto.price;
  if (dto.comparePrice !== undefined) backendData.compare_price = dto.comparePrice;
  if (dto.costPrice !== undefined) backendData.cost_price = dto.costPrice;
  if (dto.dimensions !== undefined) backendData.dimensions = dto.dimensions;
  if (dto.weight !== undefined) backendData.weight = dto.weight;
  if (dto.material !== undefined) backendData.material = dto.material;
  if (dto.finish !== undefined) backendData.finish = dto.finish;
  if (dto.color !== undefined) backendData.color = dto.color;
  if (dto.metaTitle !== undefined) backendData.meta_title = dto.metaTitle;
  if (dto.metaDescription !== undefined) backendData.meta_description = dto.metaDescription;
  if (dto.keywords !== undefined) backendData.keywords = dto.keywords;
  if (dto.stockQuantity !== undefined) backendData.stock_quantity = dto.stockQuantity;
  if (dto.lowStockThreshold !== undefined) backendData.low_stock_threshold = dto.lowStockThreshold;

  return backendData;
};

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
      data: BackendProduct[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/products?${queryParams.toString()}`);

    return {
      data: response.data.map(transformProduct),
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      totalPages: response.pagination.totalPages,
    };
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{ success: boolean; data: BackendProduct }>(`/products/${id}`);
    return transformProduct(response.data);
  },

  create: async (data: CreateProductDTO): Promise<Product> => {
    const backendData = transformToBackend(data);
    const response = await apiClient.post<{ success: boolean; data: BackendProduct }>('/products', backendData);
    return transformProduct(response.data);
  },

  update: async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
    const backendData = transformToBackend(data);
    const response = await apiClient.patch<{ success: boolean; data: BackendProduct }>(`/products/${id}`, backendData);
    return transformProduct(response.data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },

  toggleActive: async (id: string): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}/toggle-active`);
  },
};
