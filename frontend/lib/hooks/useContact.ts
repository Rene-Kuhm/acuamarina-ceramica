"use client";

import { useMutation } from "@tanstack/react-query";
import { contactApi } from "@/lib/api/contact";
import type { ContactForm } from "@/lib/types";

/**
 * Hook to send contact form
 */
export function useContactForm() {
  return useMutation<{ message: string }, Error, ContactForm>({
    mutationFn: (data) => contactApi.send(data),
  });
}
