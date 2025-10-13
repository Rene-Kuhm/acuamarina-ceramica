"use client";

import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Producto } from "@/lib/api/productos";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
  products?: Producto[];
  isLoading?: boolean;
  featured?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

/**
 * ProductGrid Component
 * Displays a responsive grid of products with loading and empty states
 */
export function ProductGrid({
  products = [],
  isLoading = false,
  featured = false,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  className,
}: ProductGridProps) {
  // Generate grid column classes based on breakpoints
  const gridCols = cn(
    "grid gap-4 sm:gap-6",
    columns.sm === 1 && "grid-cols-1",
    columns.sm === 2 && "grid-cols-2",
    columns.md === 2 && "md:grid-cols-2",
    columns.md === 3 && "md:grid-cols-3",
    columns.lg === 2 && "lg:grid-cols-2",
    columns.lg === 3 && "lg:grid-cols-3",
    columns.lg === 4 && "lg:grid-cols-4",
    columns.xl === 3 && "xl:grid-cols-3",
    columns.xl === 4 && "xl:grid-cols-4",
    columns.xl === 5 && "xl:grid-cols-5",
    className
  );

  // Loading State
  if (isLoading) {
    return (
      <div className={gridCols}>
        {Array.from({ length: columns.xl || 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-primary-light p-6 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-600 max-w-md">
          En este momento no hay productos para mostrar. Por favor, vuelve más tarde.
        </p>
      </div>
    );
  }

  // Products Grid
  return (
    <div className={gridCols}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} featured={featured} />
      ))}
    </div>
  );
}

/**
 * ProductCardSkeleton Component
 * Loading skeleton for ProductCard
 */
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content Skeleton */}
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-8 w-32" />
      </CardContent>

      {/* Footer Skeleton */}
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
