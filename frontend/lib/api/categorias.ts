import { apiClient } from "./client";

export interface Categoria {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Categoria> => {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
  },
};
