"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCartStore } from "@/lib/store/cart";

export default function CarritoPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } =
    useCartStore();
  const [isClearing, setIsClearing] = useState(false);

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Carrito de Compras" },
  ];

  const handleQuantityChange = (id: number, newQuantity: number, maxStock: number) => {
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del carrito?")) {
      removeItem(id);
    }
  };

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const total = subtotal; // El envío se coordina por separado

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
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
                  <ShoppingCart className="w-16 h-16 text-[#14b8a6]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-600 mb-8">
                Agrega productos a tu carrito para comenzar tu compra
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59] text-white shadow-lg hover:shadow-xl"
              >
                <Link href="/productos">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ir a Productos
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
      {/* Header */}
      <section className="bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] border-b py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-[#e15540] hover:text-[#c9442e] hover:bg-[#fef2f2]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar carrito
            </Button>
          )}
        </div>

        {/* Shipping Info */}
        <Alert className="mb-6 border-[#14b8a6] bg-[#f0fdfa]">
          <AlertCircle className="h-4 w-4 text-[#14b8a6]" />
          <AlertDescription className="text-gray-900">
            El costo de envío se coordina según tu ubicación. Nos contactaremos después de tu compra para acordar la mejor opción.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-gray-200 hover:border-[#14b8a6] transition-colors duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/productos/${item.slug}`}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/productos/${item.slug}`}
                            className="font-semibold text-gray-900 hover:text-[#14b8a6] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-lg font-bold text-[#14b8a6] mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1, item.stock)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-4 py-1 border rounded-md font-medium min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1, item.stock)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-[#e15540] hover:text-[#c9442e] hover:bg-[#fef2f2]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.stock && (
                        <p className="text-sm text-amber-600 mt-2">
                          Stock máximo alcanzado
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2 border-[#14b8a6] shadow-xl">
              <CardHeader className="pb-4 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1]">
                <CardTitle className="text-xl font-bold text-gray-900">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total destacado arriba */}
                <div className="bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-lg p-6 border-2 border-[#14b8a6]">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Total a Pagar</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-[#14b8a6] to-[#0d9488] bg-clip-text text-transparent">{formatPrice(total)}</p>
                    <p className="text-xs text-gray-600">{totalItems} {totalItems === 1 ? "producto" : "productos"}</p>
                  </div>
                </div>

                {/* Desglose */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold text-amber-600">A convenir</span>
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59] text-white text-base font-bold py-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full border-[#14b8a6] text-[#14b8a6] hover:bg-[#f0fdfa]"
                >
                  <Link href="/productos">Seguir Comprando</Link>
                </Button>

                {/* Security Info */}
                <div className="pt-4 border-t space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="font-medium">Compra 100% segura</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="font-medium">Garantía de devolución</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="font-medium">Soporte 24/7</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
