import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  getTotalItems: () => number;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (!existingItem) {
          set({
            items: [...items, { ...item, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      getTotalItems: () => {
        return get().items.length;
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
