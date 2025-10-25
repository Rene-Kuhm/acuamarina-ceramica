"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulación - aquí iría la lógica real de recuperación
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#ccfbf1] to-[#99f6e4] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-gray-200">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Email Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de recuperación a {email}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Button asChild className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59]">
              <Link href="/auth/login">Volver al inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#ccfbf1] to-[#99f6e4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="space-y-1">
          <Link
            href="/auth/login"
            className="flex items-center text-sm text-[#14b8a6] hover:text-[#0d9488] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Ingresa tu email y te enviaremos instrucciones para restablecerla
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-[#e15540] bg-[#fef2f2]">
                <AlertDescription className="text-gray-900">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                "Enviar instrucciones"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
              <Link
                href="/auth/login"
                className="text-[#14b8a6] hover:text-[#0d9488] font-medium hover:underline"
              >
                Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
