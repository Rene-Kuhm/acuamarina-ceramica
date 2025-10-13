import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Página no encontrada | Aguamarina Mosaicos",
  description: "La página que buscas no existe. Explora nuestro catálogo de cerámicos y encuentra el producto perfecto para tu proyecto.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-white rounded-full shadow-lg">
            <Search className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Verifica la URL o regresa al inicio.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary-hover">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Ir al Inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/productos">
              <Search className="w-5 h-5 mr-2" />
              Ver Productos
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Enlaces rápidos:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/categorias" className="text-primary hover:text-primary-hover hover:underline">
              Categorías
            </Link>
            <Link href="/nosotros" className="text-primary hover:text-primary-hover hover:underline">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-primary hover:text-primary-hover hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
