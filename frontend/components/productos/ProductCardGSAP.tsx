"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { Producto } from "@/lib/api/productos";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ProductCardGSAPProps {
  product: Producto;
  featured?: boolean;
  index?: number;
}

export function ProductCardGSAP({ product, featured = false, index = 0 }: ProductCardGSAPProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.from(card, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true,
      },
    });

    const handleMouseEnter = () => {
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.to(card, {
        y: -8,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.to(card, {
        y: 0,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder-product.jpg",
      stock: product.stock,
    });

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
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
      <div
        ref={cardRef}
        className={cn(
          "group relative overflow-hidden rounded-lg bg-white border border-gray-200",
          isOutOfStock && "opacity-60"
        )}
        style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)" }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <div ref={imageRef} className="w-full h-full">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge className="bg-black text-white">Destacado</Badge>
            )}
            {isOutOfStock && <Badge variant="destructive">Sin Stock</Badge>}
          </div>

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
                  : "text-gray-600"
              )}
            />
          </button>
        </div>

        <div ref={contentRef} className="p-4 space-y-2">
          {product.category && (
            <p className="text-xs text-gray-600 uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-black">
            {product.name}
          </h3>

          <p className="text-2xl font-bold text-black">
            {formatPrice(product.price)}
          </p>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-black hover:bg-gray-800 text-white transition-colors rounded-full"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Sin Stock" : "Agregar"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
