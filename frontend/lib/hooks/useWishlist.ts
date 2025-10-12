"use client";

import { useWishlistStore } from "@/lib/store/wishlist";

export function useWishlist() {
  const { items, addItem, removeItem, isInWishlist, getTotalItems, clearWishlist } =
    useWishlistStore();

  const toggleWishlist = (item: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
  }) => {
    if (isInWishlist(item.id)) {
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
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
