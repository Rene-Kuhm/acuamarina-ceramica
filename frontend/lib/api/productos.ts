import { apiClient } from "./client";

export interface Producto {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  stockQuantity?: number; // New field from backend API
  images: string[];
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  specifications: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductosParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface ProductosResponse {
  data: Producto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const productosApi = {
  getAll: async (params?: ProductosParams): Promise<ProductosResponse> => {
    const response = await apiClient.get("/products", { params });
    // El backend retorna { success, data, pagination }
    // Necesitamos transformarlo a { data, meta: { total, page, limit, totalPages } }
    return {
      data: response.data.data,
      meta: {
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.totalPages,
      },
    };
  },

  getBySlug: async (slug: string): Promise<Producto> => {
    const response = await apiClient.get(`/products/${slug}`);
    // El backend retorna { success, data }
    return response.data.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await apiClient.get(`/products/${id}`);
    // El backend retorna { success, data }
    return response.data.data;
  },

  getDestacados: async (): Promise<Producto[]> => {
    const response = await apiClient.get("/products/destacados");
    // El backend retorna { success, data }
    return response.data.data;
  },
};
