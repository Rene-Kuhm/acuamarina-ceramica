"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriasApi, type Categoria } from "@/lib/api/categorias";

/**
 * Hook to fetch all categories
 */
export function useCategorias() {
  return useQuery<Categoria[], Error>({
    queryKey: ["categorias"],
    queryFn: () => categoriasApi.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch a single category by slug
 */
export function useCategoria(slug: string) {
  return useQuery<Categoria, Error>({
    queryKey: ["categorias", slug],
    queryFn: () => categoriasApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
