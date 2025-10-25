"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mercadopagoApi, PaymentStatusResponse } from "@/lib/api/mercadopago";

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");

    if (paymentId) {
      // Fetch payment details
      mercadopagoApi.getPaymentStatus(paymentId)
        .then(data => {
          setPaymentInfo(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching payment status:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const getPendingMessage = (statusDetail?: string) => {
    const messages: Record<string, string> = {
      pending_contingency: "Estamos procesando tu pago. Te notificaremos cuando se complete.",
      pending_review_manual: "Tu pago está en revisión. Te notificaremos el resultado pronto.",
      pending_waiting_payment: "Estamos esperando la confirmación de tu pago.",
      pending_waiting_transfer: "Estamos esperando la transferencia bancaria.",
    };

    return messages[statusDetail || ""] || "Tu pago está siendo procesado";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Pago Pendiente
            </CardTitle>
          </CardHeader>

          <CardContent className="py-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-2">
                Tu pago está siendo procesado
              </p>
              <p className="text-gray-500">
                Te notificaremos por email cuando se confirme
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-4">Verificando pago...</p>
              </div>
            ) : paymentInfo ? (
              <div className="mb-8">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-800">
                    {getPendingMessage(paymentInfo.statusDetail)}
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-6 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Detalles del Pago</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID de Pago:</span>
                      <span className="font-medium text-gray-900">{paymentInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium text-yellow-600">
                        {paymentInfo.status === "pending" ? "Pendiente" : paymentInfo.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monto:</span>
                      <span className="font-medium text-gray-900">
                        ${paymentInfo.transactionAmount.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary-hover"
              >
                <Link href="/pedidos">
                  <Package className="w-5 h-5 mr-2" />
                  Ver Mis Pedidos
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">¿Qué sucede ahora?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Tu pedido ha sido registrado correctamente</li>
                <li>• Recibirás un email cuando se confirme el pago</li>
                <li>• El estado se actualizará automáticamente</li>
                <li>• Puedes revisar el progreso en &quot;Mis Pedidos&quot;</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}
