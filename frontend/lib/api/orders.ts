import { apiClient } from "./client";
import type { Order } from "@/lib/types";

export interface CreateOrderData {
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "transfer";
}

export const ordersApi = {
  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
};
