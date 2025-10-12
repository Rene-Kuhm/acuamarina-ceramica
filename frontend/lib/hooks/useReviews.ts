"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, CreateReviewDTO } from "@/lib/api/reviews";

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.getProductReviews(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: CreateReviewDTO) =>
      reviewsApi.createReview(reviewData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.product_id],
      });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      reviewData,
    }: {
      reviewId: number;
      reviewData: Partial<CreateReviewDTO>;
    }) => reviewsApi.updateReview(reviewId, reviewData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", data.product_id],
      });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
