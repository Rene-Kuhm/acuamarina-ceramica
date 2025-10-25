import { apiClient } from "./client";

export interface Address {
  id: string;
  userId: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  streetNumber: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  label?: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  streetNumber: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export type UpdateAddressData = Partial<CreateAddressData>;

export const addressesApi = {
  getAll: async (): Promise<Address[]> => {
    const response = await apiClient.get("/addresses");
    return response.data.data;
  },

  getById: async (id: string): Promise<Address> => {
    const response = await apiClient.get(`/addresses/${id}`);
    return response.data.data;
  },

  create: async (data: CreateAddressData): Promise<Address> => {
    const response = await apiClient.post("/addresses", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateAddressData): Promise<Address> => {
    const response = await apiClient.put(`/addresses/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<void> => {
    await apiClient.patch(`/addresses/${id}/set-default`);
  },
};
