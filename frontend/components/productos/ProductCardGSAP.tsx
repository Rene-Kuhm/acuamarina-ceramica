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
import { toast } from "sonner";
import confetti from "canvas-confetti";

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
    const image = imageRef.current;
    const content = contentRef.current;
    if (!card) return;

    // Animación de entrada con stagger mejorado
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        once: true,
      },
    });

    tl.from(card, {
      opacity: 0,
      y: 80,
      rotationX: -15,
      transformPerspective: 1000,
      duration: 1,
      delay: index * 0.08,
      ease: "power4.out",
    })
    .from(image, {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6")
    .from(content, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4");

    // Hover animations mejoradas con parallax
    const handleMouseEnter = () => {
      // Imagen con parallax y rotación
      gsap.to(image, {
        scale: 1.15,
        rotation: 1,
        duration: 0.7,
        ease: "power3.out",
      });

      // Card con elevación y sombra dinámica
      gsap.to(card, {
        y: -12,
        rotationY: 2,
        rotationX: -2,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        duration: 0.5,
        ease: "power3.out",
      });

      // Content con slight lift
      gsap.to(content, {
        y: -4,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        scale: 1,
        rotation: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.to(card, {
        y: 0,
        rotationY: 0,
        rotationX: 0,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.to(content, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      gsap.to(card, {
        rotationX: -rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mousemove", handleMouseMove);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mousemove", handleMouseMove);
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
      image: product.images[0] || "/placeholder-product.svg",
      stock: product.stock,
    });

    // Animación premium de "pulso" al agregar
    if (cardRef.current) {
      const tl = gsap.timeline();
      tl.to(cardRef.current, {
        scale: 0.92,
        duration: 0.1,
        ease: "power2.in",
      })
      .to(cardRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "elastic.out(1, 0.3)",
      })
      .to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

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
      <div
        ref={cardRef}
        className={cn(
          "group relative overflow-hidden rounded-lg bg-white border border-gray-200 will-change-transform",
          isOutOfStock && "opacity-60"
        )}
        style={{
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <div ref={imageRef} className="w-full h-full">
            <Image
              src={product.images[0] || "/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
              loading="lazy"
              quality={85}
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

        <div ref={contentRef} className="p-4 space-y-2">
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {product.category.name}
            </p>
          )}

          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] text-gray-900 group-hover:text-black transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xl font-bold text-black">
            {formatPrice(product.price)}
          </p>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-300 hover:shadow-lg group/btn"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
            {isOutOfStock ? "Sin Stock" : "Agregar"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
