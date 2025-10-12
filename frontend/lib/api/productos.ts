import { apiClient } from "./client";

export interface Producto {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
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
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Producto> => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getDestacados: async (): Promise<Producto[]> => {
    const response = await apiClient.get("/products/destacados");
    return response.data;
  },
};
