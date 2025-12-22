import { apiClient } from "./client";

export interface Categoria {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  productCount?: number;
  parentId?: number | null;
  parentName?: string | null;
  subcategories?: Categoria[];
  createdAt: string;
  updatedAt: string;
}

export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await apiClient.get("/categories");
    // El backend retorna { success, data }
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Categoria> => {
    const response = await apiClient.get(`/categories/${slug}`);
    // El backend retorna { success, data }
    return response.data.data;
  },
};
