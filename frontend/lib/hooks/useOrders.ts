"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type CreateOrderData } from "@/lib/api/orders";
import type { Order } from "@/lib/types";

/**
 * Hook to fetch all user orders
 */
export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: () => ordersApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: number) {
  return useQuery<Order, Error>({
    queryKey: ["orders", id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderData>({
    mutationFn: (data) => ordersApi.create(data),
    onSuccess: () => {
      // Invalidate orders cache to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
