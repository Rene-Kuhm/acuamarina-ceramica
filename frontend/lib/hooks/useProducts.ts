"use client";

import { useQuery } from "@tanstack/react-query";
import { productosApi, type Producto, type ProductosParams } from "@/lib/api/productos";

/**
 * Hook to fetch featured products
 */
export function useProductsDestacados() {
  return useQuery<Producto[], Error>({
    queryKey: ["productos", "destacados"],
    queryFn: () => productosApi.getDestacados(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch all products with filters
 */
export function useProducts(params?: ProductosParams) {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: () => productosApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single product by slug
 */
interface UseProductOptions {
  initialData?: Producto;
}

export function useProduct(slug: string, options?: UseProductOptions) {
  return useQuery<Producto, Error>({
    queryKey: ["productos", slug],
    queryFn: () => productosApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: options?.initialData,
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProductById(id: number) {
  return useQuery<Producto, Error>({
    queryKey: ["productos", "id", id],
    queryFn: () => productosApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
