"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { Producto } from "@/lib/api/productos";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Producto;
  featured?: boolean;
  className?: string;
}

/**
 * ProductCard Component
 * Displays a product card with image, name, price, and add to cart button
 */
export function ProductCard({ product, featured = false, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder-product.jpg",
      stock: product.stock,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder-product.jpg",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/productos/${product.slug}`} className="block">
      <Card
        className={cn(
          "group h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-cyan-500/50",
          isOutOfStock && "opacity-60",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge className="bg-cyan-500 text-white hover:bg-cyan-600">
                Destacado
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive">Sin Stock</Badge>
            )}
            {!isOutOfStock && product.stock < 10 && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Ultimas unidades
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            aria-label={isInWishlist(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isInWishlist(product.id)
                  ? "fill-pink-600 text-pink-600"
                  : "text-gray-600 hover:text-pink-600"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] group-hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-cyan-600">
              {formatPrice(product.price)}
            </p>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
