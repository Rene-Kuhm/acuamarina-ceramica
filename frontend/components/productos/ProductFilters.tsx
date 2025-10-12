"use client";

import { useEffect, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { cn } from "@/lib/utils";

export interface ProductFiltersProps {
  className?: string;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

/**
 * ProductFilters Component
 * Sidebar with all product filters: search, category, price range, availability, and sorting
 */
export function ProductFilters({ className, categories = [] }: ProductFiltersProps) {
  const { filters, updateFilters, clearFilters, hasActiveFilters, activeFilterCount } =
    useProductFilters();

  // Local state for inputs to enable debouncing
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [minPriceValue, setMinPriceValue] = useState(
    filters.minPrice?.toString() || ""
  );
  const [maxPriceValue, setMaxPriceValue] = useState(
    filters.maxPrice?.toString() || ""
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        updateFilters({ search: searchValue || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, updateFilters]);

  // Sync local state with URL changes
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    setMinPriceValue(filters.minPrice?.toString() || "");
  }, [filters.minPrice]);

  useEffect(() => {
    setMaxPriceValue(filters.maxPrice?.toString() || "");
  }, [filters.maxPrice]);

  const handlePriceChange = () => {
    const min = minPriceValue ? Number(minPriceValue) : undefined;
    const max = maxPriceValue ? Number(maxPriceValue) : undefined;
    updateFilters({ minPrice: min, maxPrice: max });
  };

  const formatPrice = (value: string) => {
    if (!value) return "";
    const number = Number(value.replace(/\D/g, ""));
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-semibold">Filtros</h2>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-cyan-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-cyan-600"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Buscar
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Buscar productos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Categoría
          </Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              updateFilters({ category: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rango de Precio</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              Mínimo
            </Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={minPriceValue}
              onChange={(e) => setMinPriceValue(e.target.value)}
              onBlur={handlePriceChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePriceChange();
                }
              }}
              min="0"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              Máximo
            </Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="$999999"
              value={maxPriceValue}
              onChange={(e) => setMaxPriceValue(e.target.value)}
              onBlur={handlePriceChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePriceChange();
                }
              }}
              min="0"
            />
          </div>
        </div>
        {(filters.minPrice || filters.maxPrice) && (
          <p className="text-xs text-muted-foreground">
            {filters.minPrice ? formatPrice(filters.minPrice.toString()) : "$0"} -{" "}
            {filters.maxPrice ? formatPrice(filters.maxPrice.toString()) : "∞"}
          </p>
        )}
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Disponibilidad</Label>
        <RadioGroup
          value={filters.availability || "all"}
          onValueChange={(value) =>
            updateFilters({
              availability: value === "all" ? undefined : (value as "in_stock" | "out_of_stock"),
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              Todas
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in_stock" id="in_stock" />
            <Label htmlFor="in_stock" className="font-normal cursor-pointer">
              En stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="out_of_stock" id="out_of_stock" />
            <Label htmlFor="out_of_stock" className="font-normal cursor-pointer">
              Sin stock
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sortBy" className="text-sm font-medium">
          Ordenar por
        </Label>
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
          <SelectTrigger id="sortBy">
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

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
        >
          Limpiar todos los filtros
        </Button>
      )}
    </div>
  );
}
