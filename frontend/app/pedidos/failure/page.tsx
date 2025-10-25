"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mercadopagoApi } from "@/lib/api/mercadopago";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
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

  const getErrorMessage = (statusDetail?: string) => {
    const messages: Record<string, string> = {
      cc_rejected_insufficient_amount: "Fondos insuficientes",
      cc_rejected_bad_filled_security_code: "Código de seguridad incorrecto",
      cc_rejected_bad_filled_date: "Fecha de vencimiento incorrecta",
      cc_rejected_bad_filled_other: "Datos de tarjeta incorrectos",
      cc_rejected_card_disabled: "Tarjeta deshabilitada",
      cc_rejected_other_reason: "Pago rechazado por el emisor",
    };

    return messages[statusDetail || ""] || "El pago no pudo ser procesado";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Pago Rechazado
            </CardTitle>
          </CardHeader>

          <CardContent className="py-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-2">
                No pudimos procesar tu pago
              </p>
              <p className="text-gray-500">
                Por favor, verifica tus datos e intenta nuevamente
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-4">Verificando pago...</p>
              </div>
            ) : paymentInfo ? (
              <div className="mb-8">
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Motivo del rechazo:</strong>{" "}
                    {getErrorMessage(paymentInfo.statusDetail)}
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-6 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Detalles del Intento</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID de Pago:</span>
                      <span className="font-medium text-gray-900">{paymentInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium text-red-600">
                        {paymentInfo.status === "rejected" ? "Rechazado" : paymentInfo.status}
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
                <Link href="/checkout">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Intentar Nuevamente
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Link href="/carrito">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver al Carrito
                </Link>
              </Button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Si sigues teniendo problemas, puedes:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Verificar que tu tarjeta tenga fondos suficientes</li>
                <li>• Contactar a tu banco para autorizar la compra</li>
                <li>• Intentar con otro método de pago</li>
                <li>• Contactarnos para asistencia personalizada</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
