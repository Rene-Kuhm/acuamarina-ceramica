"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductPagination } from "@/components/productos/ProductPagination";
import { ProductListHeader } from "@/components/productos/ProductListHeader";
import { MobileFilters } from "@/components/productos/MobileFilters";
import { ProductFilters } from "@/components/productos/ProductFilters";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useProductFilters } from "@/lib/hooks/useProductFilters";

function BuscarContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { filters } = useProductFilters();
  const { data: categories } = useCategorias();

  const productParams = {
    page: filters.page || 1,
    limit: 12,
    search: query,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy || "createdAt",
    sortOrder: filters.sortOrder || "desc",
  };

  const {
    data: productsData,
    isLoading,
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
    { label: "Búsqueda" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4 text-cyan-100" />
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {query ? `Resultados para "${query}"` : "Búsqueda"}
              </h1>
              <p className="text-cyan-100 mt-1">
                {meta.total} {meta.total === 1 ? "producto encontrado" : "productos encontrados"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <ProductFilters categories={categories || []} />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <ProductListHeader
              total={meta.total}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            <ProductGrid
              products={products}
              isLoading={isLoading}
              columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
            />

            {!isLoading && products.length > 0 && (
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

      <MobileFilters
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        categories={categories || []}
      />
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>}>
      <BuscarContent />
    </Suspense>
  );
}
