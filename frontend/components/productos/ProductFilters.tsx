"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { cn } from "@/lib/utils";

export interface ProductFiltersProps {
  className?: string;
  categories?: Array<{ id: number; name: string; slug: string; parentId?: number | null }>;
}

/**
 * ProductFilters Component
 * Sidebar with all product filters: search, category, price range, availability, and sorting
 */
export function ProductFilters({ className, categories = [] }: ProductFiltersProps) {
  const { filters, updateFilters, clearFilters, hasActiveFilters, activeFilterCount } =
    useProductFilters();

  // Organizar categorías jerárquicamente
  const organizedCategories = useMemo(() => {
    const parentCategories = categories.filter(c => !c.parentId);
    const childCategories = categories.filter(c => c.parentId);

    // Crear estructura jerárquica
    return parentCategories.map(parent => ({
      ...parent,
      children: childCategories.filter(child => child.parentId === parent.id)
    }));
  }, [categories]);

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
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-black" />
          <h2 className="text-lg font-semibold text-black">Filtros</h2>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-black rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-700 hover:text-black hover:bg-gray-100 font-medium"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Search - Always visible */}
      <div className="space-y-2 pb-4 border-b border-gray-200">
        <Label htmlFor="search" className="text-sm font-medium text-gray-900">
          Buscar
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion type="multiple" defaultValue={["category", "price", "availability", "sort"]} className="w-full">

        {/* Category */}
        {categories.length > 0 && (
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline hover:text-black">
              Categoría
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.category || "all"}
                onValueChange={(value) =>
                  updateFilters({ category: value === "all" ? undefined : value })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="cat-all" />
                  <Label htmlFor="cat-all" className="font-normal cursor-pointer text-gray-700">
                    Todas las categorías
                  </Label>
                </div>
                {organizedCategories.map((parent) => (
                  <div key={parent.id} className="space-y-2">
                    {/* Categoría padre */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={parent.slug} id={`cat-${parent.id}`} />
                      <Label
                        htmlFor={`cat-${parent.id}`}
                        className="font-medium cursor-pointer text-gray-900"
                      >
                        {parent.name}
                      </Label>
                    </div>
                    {/* Subcategorías */}
                    {parent.children && parent.children.length > 0 && (
                      <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-3">
                        {parent.children.map((child) => (
                          <div key={child.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={child.slug} id={`cat-${child.id}`} />
                            <Label
                              htmlFor={`cat-${child.id}`}
                              className="font-normal cursor-pointer text-gray-600 text-sm"
                            >
                              {child.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline hover:text-black">
            Rango de Precio
          </AccordionTrigger>
          <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="minPrice" className="text-xs text-gray-700 font-medium">
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
                  <Label htmlFor="maxPrice" className="text-xs text-gray-700 font-medium">
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
                <p className="text-xs text-gray-600 mt-2">
                  {filters.minPrice ? formatPrice(filters.minPrice.toString()) : "$0"} -{" "}
                  {filters.maxPrice ? formatPrice(filters.maxPrice.toString()) : "∞"}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline hover:text-black">
            Disponibilidad
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.availability || "all"}
              onValueChange={(value) =>
                updateFilters({
                  availability: value === "all" ? undefined : (value as "in_stock" | "out_of_stock"),
                })
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer text-gray-700">
                  Todas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_stock" id="in_stock" />
                <Label htmlFor="in_stock" className="font-normal cursor-pointer text-gray-700">
                  En stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="out_of_stock" id="out_of_stock" />
                <Label htmlFor="out_of_stock" className="font-normal cursor-pointer text-gray-700">
                  Sin stock
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Sort By */}
        <AccordionItem value="sort">
          <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline hover:text-black">
            Ordenar por
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full border-black text-black hover:bg-gray-100 font-medium"
          >
            Limpiar todos los filtros
          </Button>
        </div>
      )}
    </div>
  );
}
