import { apiClient } from '@/lib/api/client';
import { Product, CreateProductDTO, PaginatedResponse } from '@/types';

// Backend Product interface - El backend ya envía en camelCase (transformProductToAPI)
// pero algunos endpoints pueden enviar en snake_case, así que soportamos ambos
interface BackendProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  short_description?: string;
  categoryId?: string;
  category_id?: string;
  categoryName?: string;
  category_name?: string;
  categorySlug?: string;
  category_slug?: string;
  price: number;
  comparePrice?: number;
  compare_price?: number;
  costPrice?: number;
  cost_price?: number;
  dimensions?: string;
  weight?: number;
  material?: string;
  finish?: string;
  color?: string;
  metaTitle?: string;
  meta_title?: string;
  metaDescription?: string;
  meta_description?: string;
  keywords?: string;
  isActive: boolean;
  is_active?: boolean;
  isFeatured: boolean;
  is_featured?: boolean;
  stockQuantity: number;
  stock_quantity?: number;
  lowStockThreshold: number;
  low_stock_threshold?: number;
  viewsCount?: number;
  views_count?: number;
  salesCount?: number;
  sales_count?: number;
  images?: string[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

// Transform backend to frontend - soporta tanto camelCase como snake_case
const transformProduct = (backend: BackendProduct): Product => ({
  id: backend.id,
  sku: backend.sku,
  name: backend.name,
  slug: backend.slug,
  description: backend.description,
  shortDescription: backend.shortDescription || backend.short_description,
  categoryId: backend.categoryId || backend.category_id,
  categoryName: backend.categoryName || backend.category_name,
  categorySlug: backend.categorySlug || backend.category_slug,
  price: backend.price,
  comparePrice: backend.comparePrice || backend.compare_price,
  costPrice: backend.costPrice || backend.cost_price,
  dimensions: backend.dimensions,
  weight: backend.weight,
  material: backend.material,
  finish: backend.finish,
  color: backend.color,
  metaTitle: backend.metaTitle || backend.meta_title,
  metaDescription: backend.metaDescription || backend.meta_description,
  keywords: backend.keywords,
  isActive: backend.isActive ?? backend.is_active ?? true,
  isFeatured: backend.isFeatured ?? backend.is_featured ?? false,
  stockQuantity: backend.stockQuantity ?? backend.stock_quantity ?? 0,
  lowStockThreshold: backend.lowStockThreshold ?? backend.low_stock_threshold ?? 5,
  viewsCount: backend.viewsCount ?? backend.views_count ?? 0,
  salesCount: backend.salesCount ?? backend.sales_count ?? 0,
  images: backend.images,
  createdAt: backend.createdAt || backend.created_at || '',
  updatedAt: backend.updatedAt || backend.updated_at || '',
});

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

    // Log para depuración - ver qué devuelve el backend
    if (response.data && response.data.length > 0) {
      const firstWithCategory = response.data.find(p => p.categoryId || p.category_id);
      if (firstWithCategory) {
        console.log('🔍 Backend response - producto con categoría:', {
          name: firstWithCategory.name,
          categoryId: firstWithCategory.categoryId || firstWithCategory.category_id,
          categoryName: firstWithCategory.categoryName || firstWithCategory.category_name,
        });
      } else {
        console.log('⚠️ Ningún producto tiene categoría asignada');
      }
    }

    const transformedData = response.data.map(transformProduct);

    // Log después de transformar
    const transformedWithCategory = transformedData.find(p => p.categoryId);
    if (transformedWithCategory) {
      console.log('✅ Después de transformar:', {
        name: transformedWithCategory.name,
        categoryId: transformedWithCategory.categoryId,
        categoryName: transformedWithCategory.categoryName,
      });
    }

    return {
      data: transformedData,
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
    // Backend espera camelCase, NO transformar a snake_case
    const response = await apiClient.post<{ success: boolean; data: BackendProduct }>('/products', data);
    return transformProduct(response.data);
  },

  update: async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
    // Log para debug
    console.log('🔄 products.service.update - Datos a enviar:', {
      id,
      categoryId: data.categoryId,
      allKeys: Object.keys(data),
    });

    // Backend espera camelCase, NO transformar a snake_case
    const response = await apiClient.patch<{ success: boolean; data: BackendProduct }>(`/products/${id}`, data);

    console.log('✅ products.service.update - Respuesta:', {
      categoryId: response.data.categoryId || response.data.category_id,
      categoryName: response.data.categoryName || response.data.category_name,
    });

    return transformProduct(response.data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },

  toggleActive: async (id: string): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}/toggle-active`);
  },
};
