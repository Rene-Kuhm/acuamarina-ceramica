"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  MapPin,
  Package,
  CheckCircle,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCartStore } from "@/lib/store/cart";
import { ordersApi } from "@/lib/api/orders";
import { mercadopagoApi } from "@/lib/api/mercadopago";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<"address" | "payment" | "confirm">("address");

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [shippingData, setShippingData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Argentina",
  });

  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "debit_card" | "bank_transfer" | "cash">("credit_card");

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Carrito", href: "/carrito" },
    { label: "Checkout" },
  ];

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

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("confirm");
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const orderData = {
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: shippingData,
        paymentMethod,
      };

      // Create the order
      const order = await ordersApi.create(orderData);

      // Create MercadoPago preference
      const preference = await mercadopagoApi.createPreference({ orderId: order.id });

      // Redirect to MercadoPago payment page
      // Note: Cart will be cleared after successful payment
      window.location.href = preference.initPoint;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al procesar el pedido");
      setIsProcessing(false);
    }
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
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-600 mb-8">
                Agrega productos antes de realizar el checkout
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover">
                <Link href="/productos">Ir a Productos</Link>
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/carrito")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al carrito
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === "address" ? "text-primary" : "text-gray-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === "address" ? "border-primary bg-primary-light" : "border-gray-300"
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Dirección</span>
            </div>
            <div className="h-px w-16 bg-gray-300" />
            <div className={`flex items-center ${currentStep === "payment" ? "text-primary" : "text-gray-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === "payment" ? "border-primary bg-primary-light" : "border-gray-300"
              }`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Pago</span>
            </div>
            <div className="h-px w-16 bg-gray-300" />
            <div className={`flex items-center ${currentStep === "confirm" ? "text-primary" : "text-gray-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === "confirm" ? "border-primary bg-primary-light" : "border-gray-300"
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Confirmar</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Step */}
            {currentStep === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Dirección de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Nombre Completo</Label>
                      <Input
                        id="customerName"
                        placeholder="Juan Pérez"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="juan@example.com"
                          value={customerData.email}
                          onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Teléfono</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          placeholder="+54 9 11 1234-5678"
                          value={customerData.phone}
                          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-2">
                      <Label htmlFor="street">Calle y Número</Label>
                      <Input
                        id="street"
                        placeholder="Av. Corrientes 1234"
                        value={shippingData.street}
                        onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          placeholder="Buenos Aires"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Provincia</Label>
                        <Input
                          id="state"
                          placeholder="CABA"
                          value={shippingData.state}
                          onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                          id="zipCode"
                          placeholder="C1043"
                          value={shippingData.zipCode}
                          onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input
                          id="country"
                          value={shippingData.country}
                          disabled
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
                      Continuar al Pago
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                          <div className="font-medium">Tarjeta de Crédito</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="debit_card" id="debit_card" />
                        <Label htmlFor="debit_card" className="flex-1 cursor-pointer">
                          <div className="font-medium">Tarjeta de Débito</div>
                          <div className="text-sm text-gray-500">Débito nacional</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                          <div className="font-medium">Transferencia Bancaria</div>
                          <div className="text-sm text-gray-500">CBU o Alias</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="font-medium">Efectivo</div>
                          <div className="text-sm text-gray-500">Pago contra entrega</div>
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentStep("address")}
                      >
                        Volver
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover">
                        Continuar a Confirmación
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Confirm Step */}
            {currentStep === "confirm" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                    Confirmar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Dirección de Envío</h3>
                    <p className="text-gray-600 text-sm">
                      {shippingData.street}<br />
                      {shippingData.city}, {shippingData.state}<br />
                      CP: {shippingData.zipCode}, {shippingData.country}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Método de Pago</h3>
                    <p className="text-gray-600 text-sm">
                      {paymentMethod === "credit_card" && "Tarjeta de Crédito"}
                      {paymentMethod === "debit_card" && "Tarjeta de Débito"}
                      {paymentMethod === "bank_transfer" && "Transferencia Bancaria"}
                      {paymentMethod === "cash" && "Efectivo"}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-4">Productos</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-gray-500">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep("payment")}
                      disabled={isProcessing}
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      className="flex-1 bg-primary hover:bg-primary-hover"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                    <span className="font-medium text-amber-600">A convenir</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  El costo de envío se coordinará según tu ubicación después de la compra.
                </p>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
