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
  const shipping = subtotal > 50000 ? 0 : 5000;
  const tax = subtotal * 0.21; // 21% IVA
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
                  <ShoppingCart className="w-16 h-16 text-gray-400" />
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
                className="bg-cyan-600 hover:bg-cyan-700"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar carrito
            </Button>
          )}
        </div>

        {/* Free Shipping Alert */}
        {subtotal < 50000 && (
          <Alert className="mb-6 border-cyan-200 bg-cyan-50">
            <AlertCircle className="h-4 w-4 text-cyan-600" />
            <AlertDescription className="text-cyan-800">
              Agrega {formatPrice(50000 - subtotal)} más para obtener{" "}
              <strong>envío gratis</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
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
                            className="font-semibold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-lg font-bold text-cyan-600 mt-2">
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} productos)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                      {shipping === 0 ? "¡Gratis!" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (21%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-cyan-600">{formatPrice(total)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Link href="/productos">Seguir Comprando</Link>
                </Button>

                {/* Security Info */}
                <div className="pt-4 space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Compra 100% segura
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Garantía de devolución
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Soporte 24/7
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
