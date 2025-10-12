"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { cn } from "@/lib/utils";

export interface ProductListHeaderProps {
  total: number;
  onOpenMobileFilters?: () => void;
  showMobileFilters?: boolean;
  className?: string;
}

/**
 * ProductListHeader Component
 * Header for product list with total count, sort options, and mobile filter button
 */
export function ProductListHeader({
  total,
  onOpenMobileFilters,
  showMobileFilters = true,
  className,
}: ProductListHeaderProps) {
  const { filters, updateFilters, activeFilterCount } = useProductFilters();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6",
        className
      )}
    >
      {/* Total Count */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">
          {total > 0 ? (
            <>
              <span className="text-cyan-600">{total}</span>{" "}
              {total === 1 ? "producto encontrado" : "productos encontrados"}
            </>
          ) : (
            "No se encontraron productos"
          )}
        </h2>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile Filters Button */}
        {showMobileFilters && (
          <Button
            variant="outline"
            onClick={onOpenMobileFilters}
            className="lg:hidden relative"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-cyan-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            Ordenar:
          </span>
          <Select
            value={
              filters.sortBy && filters.sortOrder
                ? `${filters.sortBy}_${filters.sortOrder}`
                : "createdAt_desc"
            }
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split("_") as [
                "createdAt" | "price" | "name",
                "asc" | "desc"
              ];
              updateFilters({ sortBy, sortOrder });
            }}
          >
            <SelectTrigger className="w-[180px] sm:w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Más recientes</SelectItem>
              <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="name_asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name_desc">Nombre: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
