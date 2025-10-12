"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, X, ShoppingCart, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useComparison } from "@/lib/hooks/useComparison";
import { useCartStore } from "@/lib/store/cart";
import { useWishlist } from "@/lib/hooks/useWishlist";

export default function ComparacionPage() {
  const { items, removeItem, clearComparison } = useComparison();
  const { addItem: addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Comparar Productos" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
      stock: item.stock,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (item: any) => {
    toggleWishlist({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
    });
  };

  // Get all unique specification keys
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specifications || {})))
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gray-100 rounded-full">
                  <div className="w-16 h-16 flex items-center justify-center text-gray-400 text-4xl">
                    ⚖️
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No hay productos para comparar
              </h2>
              <p className="text-gray-600 mb-8">
                Agrega productos desde la página de productos para compararlos aquí
              </p>
              <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                <Link href="/productos">Explorar Productos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Comparar Productos
            </h1>
            <p className="text-gray-600 mt-1">
              Comparando {items.length} {items.length === 1 ? "producto" : "productos"}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm("¿Deseas limpiar la comparación?")) {
                  clearComparison();
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar comparación
            </Button>
          )}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                      Característica
                    </th>
                    {items.map((item) => (
                      <th key={item.id} className="px-6 py-4 text-center min-w-[250px]">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Link href={`/productos/${item.slug}`} className="block">
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                              <Image
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-cyan-600">
                              {item.name}
                            </h3>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* Category */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Categoría</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {item.category?.name || "-"}
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Precio</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-cyan-600">
                          {formatPrice(item.price)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Stock */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Disponibilidad</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        {item.stock > 0 ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            En Stock ({item.stock})
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Sin Stock</Badge>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Specifications */}
                  {allSpecKeys.map((key, index) => (
                    <tr key={key} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                        {key}
                      </td>
                      {items.map((item) => (
                        <td key={item.id} className="px-6 py-4 text-center text-sm text-gray-700">
                          {item.specifications?.[key] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Actions */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Acciones</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={item.stock === 0}
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                            size="sm"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Agregar al carrito
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleWishlist(item)}
                              className={
                                isInWishlist(item.id)
                                  ? "flex-1 border-pink-600 text-pink-600 hover:bg-pink-50"
                                  : "flex-1"
                              }
                            >
                              <Heart
                                className={
                                  isInWishlist(item.id)
                                    ? "w-4 h-4 fill-pink-600"
                                    : "w-4 h-4"
                                }
                              />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="flex-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Puedes comparar hasta 4 productos a la vez
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/productos">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Productos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
