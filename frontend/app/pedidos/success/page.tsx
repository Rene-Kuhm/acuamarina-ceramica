"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mercadopagoApi } from "@/lib/api/mercadopago";

export default function PaymentSuccessPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              ¡Pago Exitoso!
            </CardTitle>
          </CardHeader>

          <CardContent className="py-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-2">
                Tu pago ha sido procesado correctamente
              </p>
              <p className="text-gray-500">
                Recibirás un email de confirmación con los detalles de tu pedido
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-4">Verificando pago...</p>
              </div>
            ) : paymentInfo ? (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Detalles del Pago</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID de Pago:</span>
                    <span className="font-medium text-gray-900">{paymentInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium text-green-600">
                      {paymentInfo.status === "approved" ? "Aprobado" : paymentInfo.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-medium text-gray-900">
                      ${paymentInfo.transactionAmount.toLocaleString("es-AR")}
                    </span>
                  </div>
                  {paymentInfo.dateApproved && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(paymentInfo.dateApproved).toLocaleDateString("es-AR")}
                      </span>
                    </div>
                  )}
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
                <Link href="/productos">
                  Continuar Comprando
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
