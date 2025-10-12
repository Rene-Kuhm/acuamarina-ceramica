"use client";

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { newsletterApi } = await import("@/lib/api/newsletter");
      await newsletterApi.subscribe(email);

      setSuccess(true);
      setEmail("");

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Error al suscribirse. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ¡Suscripción exitosa! Revisa tu email para confirmar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="pl-10"
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isSubmitting ? "Suscribiendo..." : "Suscribirse"}
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-2">
        Al suscribirte, aceptas recibir nuestras ofertas y novedades.
      </p>
    </div>
  );
}
