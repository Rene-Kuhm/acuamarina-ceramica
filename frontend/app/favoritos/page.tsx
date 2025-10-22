"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCartStore } from "@/lib/store/cart";

export default function FavoritosPage() {
  const { items, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem: addToCart } = useCartStore();
  const [isClearing, setIsClearing] = useState(false);

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Favoritos" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClearWishlist = () => {
    if (confirm("¿Estás seguro de que deseas vaciar toda tu lista de favoritos?")) {
      setIsClearing(true);
      clearWishlist();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const handleAddToCart = (item: { id: number; name: string; slug: string; price: number; image: string }) => {
    addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
      stock: 100, // Default stock, should come from API
      quantity: 1,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] border-b py-6">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center py-12 border-gray-200 shadow-lg">
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full">
                  <Heart className="w-16 h-16 text-[#14b8a6]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu lista de favoritos está vacía
              </h2>
              <p className="text-gray-600 mb-8">
                Agrega productos a tu lista para guardarlos y comprarlos más tarde
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59] text-white shadow-lg hover:shadow-xl"
              >
                <Link href="/productos">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explorar Productos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] border-b py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-[#e15540] fill-[#e15540]" />
              Mis Favoritos
            </h1>
            <p className="text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? "producto" : "productos"} guardados
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="text-[#e15540] hover:text-[#c9442e] hover:bg-[#fef2f2]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar lista
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl hover:border-[#14b8a6] transition-all duration-300 border-gray-200">
              <CardContent className="p-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Link href={`/productos/${item.slug}`}>
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-[#fef2f2] transition-colors"
                    aria-label="Quitar de favoritos"
                  >
                    <Heart className="w-5 h-5 text-[#e15540] fill-[#e15540]" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/productos/${item.slug}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-[#14b8a6] transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#14b8a6]">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59] text-white"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="border-gray-300 hover:border-[#e15540] hover:text-[#e15540]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Agregado el {new Date(item.addedAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#f0fdfa]">
            <Link href="/productos">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Seguir Explorando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
