"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateReview } from "@/lib/hooks/useReviews";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    if (!comment.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    try {
      await createReview.mutateAsync({
        product_id: productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");

      onSuccess?.();
    } catch (error) {
      // El error ya es manejado por React Query y se mostrará en la UI
      console.error("Error creating review:", error);

      // Mostrar mensaje específico para error 409 (ya existe reseña)
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      if (axiosError?.response?.status === 409) {
        alert(axiosError?.response?.data?.message || "Ya has dejado una reseña para este producto");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escribir una Reseña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Calificación *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating} {rating === 1 ? "estrella" : "estrellas"}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Título (opcional)</Label>
            <Input
              id="review-title"
              placeholder="Resume tu experiencia..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">Comentario *</Label>
            <Textarea
              id="review-comment"
              placeholder="Cuéntanos sobre tu experiencia con este producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500 text-right">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Error Message */}
          {createReview.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {((createReview.error as { response?: { data?: { message?: string } } })?.response?.data?.message) ||
                 createReview.error?.message ||
                 "Error al enviar la reseña. Por favor intenta nuevamente."}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-hover"
              disabled={createReview.isPending}
            >
              {createReview.isPending ? "Enviando..." : "Publicar Reseña"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createReview.isPending}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
