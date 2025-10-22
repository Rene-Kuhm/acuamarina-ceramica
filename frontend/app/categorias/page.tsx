"use client";

import Link from "next/link";
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

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} className="[&_a]:text-white/80 [&_a]:hover:text-white [&_span]:text-white/90 [&_svg]:text-white/60" />
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="glass p-4 rounded-xl">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-white via-[#f0fdfa] to-white bg-clip-text text-transparent">
                  Categorías
                </span>
              </h1>
            </div>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              Explora nuestra colección completa de productos organizados por categoría.
              Encuentra exactamente lo que necesitas para tu proyecto.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {error && (
          <Alert variant="destructive" className="mb-8 border-[#e15540] bg-[#fef2f2]">
            <AlertDescription className="text-gray-900">
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
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Todas las Categorías
              </h2>
              <p className="text-gray-600 text-lg">
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
                  <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] hover:border-[#14b8a6] cursor-pointer bg-white">
                    {/* Category Image with Aquamarina gradient */}
                    <div className="relative h-48 bg-gradient-to-br from-[#f0fdfa] via-[#ccfbf1] to-[#99f6e4] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shapes className="w-16 h-16 text-[#14b8a6]/40" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14b8a6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-[#14b8a6] transition-colors duration-300 flex items-center justify-between">
                        {category.name}
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-gray-600">
                        {category.description || `Explora nuestra selección de ${category.name.toLowerCase()}`}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center text-sm text-[#14b8a6] font-medium">
                        Ver productos
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-6 rounded-full bg-[#f0fdfa] mb-6">
              <Shapes className="w-16 h-16 text-[#14b8a6]" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Actualmente no tenemos categorías para mostrar.
            </p>
          </div>
        )}
      </div>

      {/* CTA Section - Aquamarina Style */}
      <section className="relative bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#2dd4bf] text-white py-16 overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f0fdfa] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está aquí para ayudarte a encontrar el producto perfecto para tu proyecto
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center px-8 py-4 bg-white text-[#14b8a6] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Contáctanos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
