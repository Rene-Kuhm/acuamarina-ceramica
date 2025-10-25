import { apiClient } from "./client";

export interface CreatePreferenceData {
  orderId: number;
}

export interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export interface PaymentStatusResponse {
  id: string;
  status: string;
  statusDetail: string;
  externalReference: string;
  transactionAmount: number;
  dateApproved?: string;
}

export const mercadopagoApi = {
  createPreference: async (data: CreatePreferenceData): Promise<PreferenceResponse> => {
    const response = await apiClient.post("/mercadopago/create-preference", data);
    return response.data.data;
  },

  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.get(`/mercadopago/payment/${paymentId}`);
    return response.data.data;
  },

  getPublicKey: async (): Promise<string> => {
    const response = await apiClient.get("/mercadopago/public-key");
    return response.data.data.publicKey;
  },
};
