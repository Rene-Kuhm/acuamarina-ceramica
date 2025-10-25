import apiClient from "./client";

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewDTO {
  product_id: number;
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export const reviewsApi = {
  getProductReviews: async (productId: number): Promise<ReviewsResponse> => {
    const { data } = await apiClient.get(`/reviews/product/${productId}`);
    return data.data; // Backend devuelve { success: true, data: { reviews: ... } }
  },

  createReview: async (reviewData: CreateReviewDTO): Promise<Review> => {
    const { data } = await apiClient.post("/reviews", reviewData);
    return data.data; // Backend devuelve { success: true, data: { review } }
  },

  updateReview: async (
    reviewId: number,
    reviewData: Partial<CreateReviewDTO>
  ): Promise<Review> => {
    const { data } = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return data.data; // Backend devuelve { success: true, data: { review } }
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },
};
