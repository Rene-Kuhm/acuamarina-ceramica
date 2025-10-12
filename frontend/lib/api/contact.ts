import { apiClient } from "./client";
import type { ContactForm } from "@/lib/types";

export const contactApi = {
  send: async (data: ContactForm): Promise<{ message: string }> => {
    const response = await apiClient.post("/contact", data);
    return response.data;
  },
};
