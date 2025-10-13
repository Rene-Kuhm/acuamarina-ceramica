"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-white rounded-full shadow-lg">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
            500
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Algo salió mal
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, ocurrió un error inesperado. Nuestro equipo ha sido notificado
          y estamos trabajando para solucionarlo.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-white rounded-lg border border-red-200 text-left max-w-xl mx-auto">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Intentar nuevamente
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Ir al Inicio
            </Link>
          </Button>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            ¿El problema persiste?
          </p>
          <Link
            href="/contacto"
            className="text-primary hover:text-primary-hover hover:underline font-medium"
          >
            Contáctanos para obtener ayuda
          </Link>
        </div>
      </div>
    </div>
  );
}
