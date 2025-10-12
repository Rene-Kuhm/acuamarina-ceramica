import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComparisonItem {
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
}

interface ComparisonStore {
  items: ComparisonItem[];
  addItem: (item: ComparisonItem) => void;
  removeItem: (id: number) => void;
  clearComparison: () => void;
  isInComparison: (id: number) => boolean;
  getTotalItems: () => number;
}

const MAX_COMPARISON_ITEMS = 4;

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (!existingItem && items.length < MAX_COMPARISON_ITEMS) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearComparison: () => {
        set({ items: [] });
      },

      isInComparison: (id) => {
        return get().items.some((i) => i.id === id);
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "comparison-storage",
    }
  )
);
