"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: "in_stock" | "out_of_stock" | "all";
  sortBy?: "createdAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  updateFilters: (updates: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

/**
 * Hook to manage product filters via URL search parameters
 * Allows sharing filtered URLs and browser back/forward navigation
 */
export function useProductFilters(): UseProductFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const filters = useMemo<ProductFilters>(() => {
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const availability = searchParams.get("availability") as ProductFilters["availability"] || undefined;
    const sortBy = searchParams.get("sortBy") as ProductFilters["sortBy"] || undefined;
    const sortOrder = searchParams.get("sortOrder") as ProductFilters["sortOrder"] || undefined;
    const page = searchParams.get("page");

    return {
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      availability,
      sortBy,
      sortOrder,
      page: page ? Number(page) : undefined,
    };
  }, [searchParams]);

  // Calculate if there are active filters (excluding sort and page)
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.category ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.availability && filters.availability !== "all")
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.availability && filters.availability !== "all") count++;
    return count;
  }, [filters]);

  // Update filters and URL
  const updateFilters = useCallback(
    (updates: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 if any filter changes (except page itself)
      if (!("page" in updates) && Object.keys(updates).length > 0) {
        params.delete("page");
      }

      // Navigate to new URL
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
