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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Ocean Wave Style */}
      <section className="relative bg-gradient-wave py-16 sm:py-24 overflow-hidden">
        {/* Floating Bubbles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animation: `float-up ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Breadcrumb
              items={breadcrumbItems.map(item => ({
                ...item,
                label: item.label,
              }))}
              className="[&_a]:text-white/80 [&_a]:hover:text-white [&_span]:text-white/90 [&_svg]:text-white/60"
            />
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-[#f0fdfa] to-white bg-clip-text text-transparent">
                Nuestros Productos
              </span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              Explora nuestra amplia selección de cerámicos de alta calidad, diseñados para transformar tus espacios
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-[#e15540] bg-[#fef2f2]">
            <AlertCircle className="h-5 w-5 text-[#e15540]" />
            <AlertDescription className="text-gray-900 font-medium text-sm sm:text-base">
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
                  currentPage={filters.page || 1}
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
      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-wave py-16 sm:py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-64 mb-6 bg-white/30" />
            <Skeleton className="h-12 w-96 mb-4 bg-white/30" />
            <Skeleton className="h-6 w-[500px] bg-white/20" />
          </div>
        </section>
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
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
