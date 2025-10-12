"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { Grid3x3 } from "lucide-react";
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

function CategoryProductsContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { filters } = useProductFilters();

  // Fetch all categories to find current category
  const { data: categories, isLoading: categoriesLoading } = useCategorias();
  const currentCategory = categories?.find((cat) => cat.slug === slug);

  // Build params for products query
  const productParams = {
    page: filters.page || 1,
    limit: 12,
    category: slug, // Filter by current category
    search: filters.search,
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
    { label: "Categorías", href: "/categorias" },
    { label: currentCategory?.name || "Cargando..." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4 text-cyan-100" />
          {categoriesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-96 bg-cyan-700" />
              <Skeleton className="h-6 w-[500px] bg-cyan-700" />
            </div>
          ) : currentCategory ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Grid3x3 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {currentCategory.name}
                </h1>
              </div>
              {currentCategory.description && (
                <p className="mt-2 text-cyan-100 text-sm sm:text-base max-w-2xl">
                  {currentCategory.description}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Categoría no encontrada
            </h1>
          )}
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

            {/* Empty State */}
            {!productsLoading && products.length === 0 && (
              <div className="text-center py-16">
                <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros o buscar otros productos
                </p>
              </div>
            )}

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

export default function CategoryProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-8 sm:py-12">
            <div className="container mx-auto px-4">
              <Skeleton className="h-8 w-64 mb-4 bg-cyan-700" />
              <Skeleton className="h-10 w-96 bg-cyan-700" />
            </div>
          </section>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <aside className="hidden lg:block lg:col-span-1">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </aside>
              <main className="lg:col-span-3">
                <Skeleton className="h-12 w-full mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-96 w-full" />
                  ))}
                </div>
              </main>
            </div>
          </div>
        </div>
      }
    >
      <CategoryProductsContent />
    </Suspense>
  );
}
