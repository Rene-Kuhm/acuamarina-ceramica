"use client";

import { Suspense, useState } from "react";
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

function ProductosContent() {
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
      <section className="bg-gradient-hero text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="text-white mb-4" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white">
            Nuestros Productos
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl">
            Explora nuestra amplia selección de cerámicos de alta calidad
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-600 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900 font-medium text-sm sm:text-base">
              Error al cargar los productos. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
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
          <main className="min-w-0">
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
              <div className="mt-6 sm:mt-8">
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

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-hero text-white py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-64 mb-4 bg-primary/30" />
            <Skeleton className="h-10 w-96 bg-primary/30" />
          </div>
        </section>
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4 sm:gap-6 lg:gap-8">
            <aside className="hidden lg:block">
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </aside>
            <main className="min-w-0">
              <Skeleton className="h-12 w-full mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-80 sm:h-96 w-full" />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    }>
      <ProductosContent />
    </Suspense>
  );
}
