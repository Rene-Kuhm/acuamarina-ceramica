"use client";

import { useComparisonStore } from "@/lib/store/comparison";

export function useComparison() {
  const { items, addItem, removeItem, isInComparison, getTotalItems, clearComparison } =
    useComparisonStore();

  const toggleComparison = (item: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
    specifications: Record<string, string>;
    stock: number;
  }) => {
    if (isInComparison(item.id)) {
      removeItem(item.id);
      return { added: false };
    } else {
      addItem(item);
      return { added: true };
    }
  };

  return {
    items,
    totalItems: getTotalItems(),
    addItem,
    removeItem,
    toggleComparison,
    isInComparison,
    clearComparison,
  };
}
