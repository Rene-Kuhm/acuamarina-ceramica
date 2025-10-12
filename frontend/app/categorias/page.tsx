"use client";

import Link from "next/link";
import Image from "next/image";
import { Shapes, ArrowRight, Grid3x3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCategorias } from "@/lib/hooks/useCategorias";

export default function CategoriasPage() {
  const { data: categories, isLoading, error } = useCategorias();

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Categorías" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-cyan-100" />
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Grid3x3 className="w-8 h-8" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold">Categorías</h1>
            </div>
            <p className="text-lg text-cyan-100">
              Explora nuestra colección completa de productos organizados por categoría.
              Encuentra exactamente lo que necesitas para tu proyecto.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>
              Error al cargar las categorías. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Todas las Categorías
              </h2>
              <p className="text-gray-600">
                {categories.length} categorías disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-cyan-500/50 cursor-pointer">
                    {/* Category Image - Placeholder for now */}
                    <div className="relative h-48 bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-50 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shapes className="w-16 h-16 text-cyan-600/30" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                        {category.name}
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {category.description || `Explora nuestra selección de ${category.name.toLowerCase()}`}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center text-sm text-cyan-600 font-medium">
                        Ver productos
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Shapes className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Actualmente no tenemos categorías para mostrar.
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está aquí para ayudarte a encontrar el producto perfecto para tu proyecto
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Contáctanos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
