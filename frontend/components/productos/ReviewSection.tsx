"use client";

import { useState } from "react";
import { Star, ThumbsUp, VerifiedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useProductReviews } from "@/lib/hooks/useReviews";
import { Review } from "@/lib/api/reviews";
import { ReviewForm } from "./ReviewForm";
import { useAuth } from "@/lib/hooks/useAuth";

interface ReviewSectionProps {
  productId: number;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { data, isLoading } = useProductReviews(productId);
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-gray-500">Cargando reseñas...</p>
        </CardContent>
      </Card>
    );
  }

  const reviews = data?.reviews || [];
  const averageRating = data?.average_rating || 0;
  const totalReviews = data?.total_reviews || 0;
  const ratingDistribution = data?.rating_distribution || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Opiniones de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-5xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Basado en {totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 min-w-[40px] text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Write Review Button */}
          {isAuthenticated && !showReviewForm && (
            <div className="text-center">
              <Button
                onClick={() => setShowReviewForm(true)}
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Escribir una Reseña
              </Button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                <a href="/auth/login" className="text-cyan-600 hover:underline">
                  Inicia sesión
                </a>{" "}
                para escribir una reseña
              </p>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <ReviewForm
              productId={productId}
              onSuccess={() => setShowReviewForm(false)}
              onCancel={() => setShowReviewForm(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                Sé el primero en dejar una reseña para este producto
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {review.user?.name || "Usuario"}
                </span>
                {review.verified_purchase && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    <VerifiedIcon className="w-3 h-3 mr-1" />
                    Compra verificada
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            {review.title && (
              <h4 className="font-semibold text-gray-900">{review.title}</h4>
            )}
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Útil
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
