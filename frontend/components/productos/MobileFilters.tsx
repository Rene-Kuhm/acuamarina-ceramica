"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ProductFilters } from "./ProductFilters";
import { useProductFilters } from "@/lib/hooks/useProductFilters";

export interface MobileFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

/**
 * MobileFilters Component
 * Bottom sheet for mobile devices containing all product filters
 */
export function MobileFilters({
  open,
  onOpenChange,
  categories = [],
}: MobileFiltersProps) {
  const { clearFilters, hasActiveFilters } = useProductFilters();

  const handleApply = () => {
    onOpenChange(false);
  };

  const handleClearAll = () => {
    clearFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros de Productos</SheetTitle>
          <SheetDescription>
            Refina tu búsqueda con los filtros disponibles
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto py-4 pr-2">
          <ProductFilters categories={categories} />
        </div>

        {/* Footer Actions */}
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="flex-1 sm:flex-1"
            >
              Limpiar todo
            </Button>
          )}
          <Button
            onClick={handleApply}
            className="flex-1 sm:flex-1 bg-cyan-600 hover:bg-cyan-700"
          >
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
