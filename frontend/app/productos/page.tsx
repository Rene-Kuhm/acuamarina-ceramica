"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductFilters } from "@/components/productos/ProductFilters";
import { ProductPagination } from "@/components/productos/ProductPagination";
import { ProductListHeader } from "@/components/productos/ProductListHeader";
import { MobileFilters } from "@/components/productos/MobileFilters";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProductosPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { filters } = useProductFilters();

  // Fetch categories for filter options
  const { data: categories, isLoading: categoriesLoading } = useCategorias();

  // Build params for products query
  const productParams = {
    page: filters.page || 1,
    limit: 12,
    search: filters.search,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy || "createdAt",
    sortOrder: filters.sortOrder || "desc",
  };

  // Fetch products with filters
  const {
    data: productsData,
    isLoading: productsLoading,
    error,
  } = useProducts(productParams);

  const products = productsData?.data || [];
  const meta = productsData?.meta || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Productos" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4 text-cyan-100" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Nuestros Productos
          </h1>
          <p className="mt-2 text-cyan-100 text-sm sm:text-base max-w-2xl">
            Explora nuestra amplia selección de cerámicos de alta calidad
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar los productos. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              {categoriesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <ProductFilters categories={categories || []} />
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* List Header */}
            <ProductListHeader
              total={meta.total}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            {/* Products Grid */}
            <ProductGrid
              products={products}
              isLoading={productsLoading}
              columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
            />

            {/* Pagination */}
            {!productsLoading && products.length > 0 && (
              <div className="mt-8">
                <ProductPagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  total={meta.total}
                  limit={meta.limit}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <MobileFilters
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        categories={categories || []}
      />
    </div>
  );
}
