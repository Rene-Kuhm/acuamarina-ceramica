"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shapes,
  Palette,
  Layers,
  Grid3x3,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { useProductsDestacados } from "@/lib/hooks/useProducts";
import { QRCatalogo } from "@/components/QRCatalogo";

export default function HomePage() {
  const { data: productosDestacados, isLoading } = useProductsDestacados();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Premium Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #111 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="container-premium relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                <Sparkles className="w-4 h-4" />
                Bienvenido a Aguamarina Mosaicos
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
                Diseño que<br />
                <span className="text-gray-400">transforma espacios</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubre nuestra colección premium de mosaicos cerámicos.
                Calidad excepcional para proyectos extraordinarios.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button
                asChild
                size="lg"
                className="text-base"
              >
                <Link href="/productos">
                  Ver Catálogo Completo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base"
              >
                <Link href="/categorias">
                  Explorar Categorías
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Calidad Garantizada</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Envío Gratis +$50k</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                <span>Asesoría Personalizada</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categorias Destacadas Section */}
      <section className="section-spacing bg-gray-50">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Explora Nuestras Categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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

      {/* QR Catálogo Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Catálogo Móvil
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lleva nuestro catálogo completo en tu bolsillo. Escanea el código QR y accede a todos nuestros productos desde tu dispositivo móvil.
            </p>
          </div>
          <QRCatalogo />
        </div>
      </section>

      {/* Productos Destacados Section */}
      <section className="section-spacing bg-white">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
      <section className="section-spacing bg-gray-50">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
      <section className="section-spacing bg-black text-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Necesitas Asesoramiento?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              Nuestro equipo de expertos te ayuda a elegir los mejores productos
              para tu proyecto. Contáctanos y recibe atención personalizada.
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/contacto">
                Contactar Ahora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
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
      <Card className="h-full hover-lift cursor-pointer">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
            {icon}
          </div>
          <CardTitle className="text-xl text-black">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="text-base text-gray-600">
            {description}
          </CardDescription>
          <div className="mt-4 text-black font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
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
    <div className="text-center space-y-4 p-8">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-black">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
