import apiClient from "./client";

export interface NewsletterSubscription {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export const newsletterApi = {
  subscribe: async (email: string): Promise<NewsletterResponse> => {
    const { data } = await apiClient.post("/newsletter/subscribe", { email });
    return data;
  },

  unsubscribe: async (email: string): Promise<NewsletterResponse> => {
    const { data } = await apiClient.post("/newsletter/unsubscribe", { email });
    return data;
  },
};
