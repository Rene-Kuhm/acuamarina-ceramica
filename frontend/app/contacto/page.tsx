"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { contactApi } from "@/lib/api/contact";

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Contacto" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await contactApi.send(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al enviar el mensaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Ocean Wave Style */}
      <section className="relative bg-gradient-wave py-16 sm:py-24 overflow-hidden">
        {/* Floating Bubbles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animation: `float-up ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container-premium relative z-10">
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} className="[&_a]:text-white/80 [&_a]:hover:text-white [&_span]:text-white/90 [&_svg]:text-white/60" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-[#f0fdfa] to-white bg-clip-text text-transparent">
              Contacto
            </span>
          </h1>
          <p className="text-xl text-white/90">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
        </div>
      </section>

      <div className="container-premium py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-gray-200 hover:border-[#14b8a6] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#14b8a6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-sm text-gray-600">info@aguamarina.com</p>
                    <p className="text-sm text-gray-600">ventas@aguamarina.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#14b8a6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
                    <p className="text-sm text-gray-600">+54 11 1234-5678</p>
                    <p className="text-sm text-gray-600">Lun - Vie: 9:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#14b8a6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
                    <p className="text-sm text-gray-600">
                      Av. Corrientes 1234<br />
                      Buenos Aires, Argentina
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Envíanos un mensaje</CardTitle>
              <p className="text-gray-600 mt-2">Completa el formulario y te responderemos a la brevedad</p>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-6 border-[#14b8a6] bg-[#f0fdfa]">
                  <CheckCircle className="h-4 w-4 text-[#14b8a6]" />
                  <AlertDescription className="text-gray-900">
                    ¡Mensaje enviado! Te responderemos pronto.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6 border-[#e15540] bg-[#fef2f2]">
                  <AlertCircle className="h-4 w-4 text-[#e15540]" />
                  <AlertDescription className="text-gray-900">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black">Nombre Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-black">Asunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-black">Mensaje *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#115e59] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
