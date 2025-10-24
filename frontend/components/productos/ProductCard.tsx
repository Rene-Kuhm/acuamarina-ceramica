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
import { toast } from "sonner";
import confetti from "canvas-confetti";

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
      image: product.images[0] || "/placeholder-product.svg",
      stock: product.stock,
    });

    // Confetti sutil y premium
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#111111', '#666666', '#999999'],
      scalar: 0.8,
      gravity: 1.2,
      ticks: 200,
    });

    toast.success("Producto agregado", {
      description: `${product.name} se agregó al carrito`,
      duration: 3000,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const wasInWishlist = isInWishlist(product.id);

    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder-product.svg",
    });

    if (wasInWishlist) {
      toast.info("Eliminado de favoritos", {
        description: `${product.name} se eliminó de favoritos`,
        duration: 2000,
      });
    } else {
      toast.success("Agregado a favoritos", {
        description: `${product.name} se agregó a favoritos`,
        duration: 2000,
      });
    }
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
          "group h-full overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.04] hover:-translate-y-2 hover:border-gray-900",
          isOutOfStock && "opacity-60",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || "/placeholder-product.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.15] group-hover:rotate-1"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
            loading="lazy"
            quality={85}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge className="bg-primary text-white hover:bg-primary-hover">
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
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-300 hover:shadow-lg"
            aria-label={isInWishlist(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all duration-300",
                isInWishlist(product.id)
                  ? "fill-pink-600 text-pink-600 scale-110"
                  : "text-gray-600 hover:text-pink-600 hover:scale-110"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] text-gray-900 group-hover:text-black transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-black">
              {formatPrice(product.price)}
            </p>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group/btn"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
