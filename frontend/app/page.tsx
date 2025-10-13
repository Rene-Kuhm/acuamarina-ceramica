"use client";

import Link from "next/link";
import {
  Shapes,
  Palette,
  Layers,
  Grid3x3,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { useProductsDestacados } from "@/lib/hooks/useProducts";

export default function HomePage() {
  const { data: productosDestacados, isLoading } = useProductsDestacados();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        {/* Decorative Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Title with Gradient */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary-hover text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Bienvenido a tu tienda de confianza
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Aguamarina Mosaicos
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-gray-800">
                Calidad y elegancia en cada mosaico
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
             &ldquo;Somos mosaicos —pedazos de luz, amor, historia, estrellas— pegados con magia y música y palabras.&rdquo;
              <br />
              <span className="block mt-2 text-base">—Anita Krizsan</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/productos">
                  Ver Productos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-cyan-50 px-8 py-6 text-lg"
              >
                <Link href="/categorias">
                  Explorar Categorías
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Categorias Destacadas Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Explora Nuestras Categorías
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encuentra el producto perfecto para cada espacio de tu hogar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard
              icon={<Shapes className="w-8 h-8" />}
              title="Mosaicos Cerámicos"
              description="Diseños clásicos y modernos para pisos y paredes"
              href="/categorias/mosaicos-ceramicos"
            />
            <CategoryCard
              icon={<Palette className="w-8 h-8" />}
              title="Azulejos Decorativos"
              description="Dale vida a tus espacios con colores únicos"
              href="/categorias/azulejos-decorativos"
            />
            <CategoryCard
              icon={<Layers className="w-8 h-8" />}
              title="Revestimientos"
              description="Protección y estilo para paredes interiores"
              href="/categorias/revestimientos"
            />
            <CategoryCard
              icon={<Grid3x3 className="w-8 h-8" />}
              title="Pisos Cerámicos"
              description="Durabilidad y elegancia para todo tipo de ambientes"
              href="/categorias/pisos-ceramicos"
            />
          </div>
        </div>
      </section>

      {/* Productos Destacados Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de productos más populares y de mayor calidad
            </p>
          </div>

          <ProductGrid
            products={productosDestacados}
            isLoading={isLoading}
            featured={true}
            columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
          />

          {/* Ver Todos Button */}
          {productosDestacados && productosDestacados.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-cyan-50"
              >
                <Link href="/productos">
                  Ver Todos los Productos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Truck className="w-12 h-12" />}
              title="Envío Gratis"
              description="En compras mayores a $50.000. Recibe tu pedido en la puerta de tu hogar."
            />
            <BenefitCard
              icon={<ShieldCheck className="w-12 h-12" />}
              title="Calidad Garantizada"
              description="Productos de primera calidad con garantía de fabricación y durabilidad."
            />
            <BenefitCard
              icon={<Headphones className="w-12 h-12" />}
              title="Atención Personalizada"
              description="Soporte 24/7 para ayudarte a elegir el producto perfecto para tu proyecto."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Necesitas Asesoramiento?
            </h2>
            <p className="text-lg md:text-xl text-cyan-50">
              Nuestro equipo de expertos te ayuda a elegir los mejores productos
              para tu proyecto. Contáctanos y recibe atención personalizada.
            </p>
            <div className="pt-4">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white text-primary border-white hover:bg-cyan-50 px-8 py-6 text-lg"
              >
                <Link href="/contacto">
                  Contactar Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * CategoryCard Component
 * Displays a category card with icon, title, description, and link
 */
interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function CategoryCard({ icon, title, description, href }: CategoryCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-cyan-500/50 cursor-pointer">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {icon}
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="text-base">
            {description}
          </CardDescription>
          <div className="mt-4 text-primary font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
            Ver más
            <ArrowRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * BenefitCard Component
 * Displays a benefit card with icon, title, and description
 */
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="text-center space-y-4 p-6">
      <div className="mx-auto w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
