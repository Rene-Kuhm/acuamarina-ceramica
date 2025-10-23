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
import { ProductGrid } from "@/components/productos/ProductGrid";
import { useProductsDestacados } from "@/lib/hooks/useProducts";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { QRCatalogo } from "@/components/QRCatalogo";

export default function HomePage() {
  const { data: productosDestacados, isLoading } = useProductsDestacados();
  const { data: categorias, isLoading: isLoadingCategorias } = useCategorias();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Ocean Wave Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-wave">
        {/* Animated Wave Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-ocean opacity-50 blur-3xl"></div>
        </div>

        {/* Floating Bubbles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animation: `float-up ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes float-up {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.2;
            }
            100% {
              transform: translateY(-100vh) scale(1.5);
              opacity: 0;
            }
          }
        `}</style>

        <div className="container-premium relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badge with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg border border-white/40" style={{ color: '#0d9488' }}>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Bienvenido a Aguamarina Mosaicos
              </div>
            </motion.div>

            {/* Main Heading with Gradient Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Diseño que<br />
                </span>
                <span className="bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#2dd4bf] bg-clip-text text-transparent">
                  transforma espacios
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
                Descubre nuestra colección premium de mosaicos cerámicos.
                <br />
                <span className="text-gray-700">Calidad excepcional para proyectos extraordinarios.</span>
              </p>
            </motion.div>

            {/* CTA Buttons with Glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 py-6 text-white font-bold glow-aqua hover:scale-105 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                }}
              >
                <Link href="/productos">
                  Ver Catálogo Completo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 border-2 font-bold hover:bg-white hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: '#14b8a6',
                  color: '#0d9488'
                }}
              >
                <Link href="/categorias">
                  Explorar Categorías
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Feature Pills with Brand Colors */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 text-sm font-medium"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
                <ShieldCheck className="w-5 h-5" style={{ color: '#14b8a6' }} />
                <span className="text-gray-800">Calidad Garantizada</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
                <Truck className="w-5 h-5" style={{ color: '#e15540' }} />
                <span className="text-gray-800">Envío Gratis +$50k</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
                <Headphones className="w-5 h-5" style={{ color: '#eab308' }} />
                <span className="text-gray-800">Asesoría Personalizada</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categorias Destacadas Section - Bento Grid */}
      <section className="section-spacing bg-gradient-mesh relative overflow-hidden">
        {/* Decorative Gradient Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#5eead4]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#f5aea3]/20 to-transparent blur-3xl" />

        <div className="container-premium relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Explora Nuestras Categorías
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Encuentra el producto perfecto para cada espacio de tu hogar
            </p>
          </div>

          {/* Bento Grid Premium - Dynamic Categories */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
            {isLoadingCategorias ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-white/50 rounded-2xl animate-pulse" />
                ))}
              </>
            ) : categorias && categorias.length > 0 ? (
              <>
                {/* Dynamic Categories - Show first 4 */}
                {categorias.slice(0, 4).map((categoria, index) => {
                  // Cycle through gradients and colors
                  const gradients = [
                    { gradient: "from-[#f0fdfa] to-[#99f6e4]", iconColor: "#14b8a6", icon: <Shapes className="w-10 h-10" /> },
                    { gradient: "from-[#fdf4f3] to-[#f9d0ca]", iconColor: "#e15540", icon: <Palette className="w-10 h-10" /> },
                    { gradient: "from-[#fefce8] to-[#fde047]", iconColor: "#eab308", icon: <Layers className="w-10 h-10" /> },
                    { gradient: "from-[#ccfbf1] to-[#5eead4]", iconColor: "#0d9488", icon: <Grid3x3 className="w-10 h-10" /> },
                  ];
                  const style = gradients[index % gradients.length];

                  return (
                    <CategoryCardBento
                      key={categoria.id}
                      icon={style.icon}
                      title={categoria.name}
                      description={categoria.description || `Explora nuestra selección de ${categoria.name.toLowerCase()}`}
                      href={`/categorias/${categoria.slug}`}
                      gradient={style.gradient}
                      iconColor={style.iconColor}
                      span={index === 0 ? "md:col-span-2" : "md:col-span-1"}
                    />
                  );
                })}
                {/* CTA Card - only show if we have categories */}
                {categorias.length > 0 && (
                  <div className="md:col-span-3 glass rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 border border-white/40 backdrop-blur-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">¿No encuentras lo que buscas?</h3>
                        <p className="text-gray-700">Explora todo nuestro catálogo de productos premium</p>
                      </div>
                      <Button
                        asChild
                        size="lg"
                        className="font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                          color: 'white'
                        }}
                      >
                        <Link href="/productos">
                          Ver Todo
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // No categories fallback
              <div className="md:col-span-4 text-center py-12">
                <p className="text-gray-600">No hay categorías disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QR Catálogo Section */}
      <section className="py-16 md:py-20 bg-gradient-ocean relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent blur-2xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-[#0d9488] bg-clip-text text-transparent">
                Catálogo Móvil
              </span>
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
              Lleva nuestro catálogo completo en tu bolsillo. Escanea el código QR y accede a todos nuestros productos desde tu dispositivo móvil.
            </p>
          </div>
          <QRCatalogo />
        </div>
      </section>

      {/* Productos Destacados Section */}
      <section className="section-spacing bg-gradient-mesh relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-[#14b8a6]/30 to-transparent blur-3xl rounded-full" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-tr from-[#e15540]/30 to-transparent blur-3xl rounded-full" />
        </div>
        <div className="container-premium relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-[#0d9488] to-gray-900 bg-clip-text text-transparent">
                Productos Destacados
              </span>
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto font-medium">
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
                className="border-2 font-bold hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: '#14b8a6',
                  color: '#0d9488'
                }}
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

      {/* Beneficios Section - Premium Cards */}
      <section className="section-spacing bg-gradient-terra relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/50 to-transparent blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCardPremium
              icon={<Truck className="w-12 h-12" />}
              title="Envío Gratis"
              description="En compras mayores a $50.000. Recibe tu pedido en la puerta de tu hogar."
              iconColor="#14b8a6"
              gradient="from-[#f0fdfa] to-[#ccfbf1]"
            />
            <BenefitCardPremium
              icon={<ShieldCheck className="w-12 h-12" />}
              title="Calidad Garantizada"
              description="Productos de primera calidad con garantía de fabricación y durabilidad."
              iconColor="#e15540"
              gradient="from-[#fdf4f3] to-[#fce8e5]"
            />
            <BenefitCardPremium
              icon={<Headphones className="w-12 h-12" />}
              title="Atención Personalizada"
              description="Soporte 24/7 para ayudarte a elegir el producto perfecto para tu proyecto."
              iconColor="#eab308"
              gradient="from-[#fefce8] to-[#fef9c3]"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Final - Dark Premium */}
      <section className="section-spacing bg-gradient-ocean-dark text-white relative overflow-hidden">
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>

        <div className="container-premium relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Necesitas Asesoramiento?
            </h2>
            <p className="text-xl md:text-2xl text-[#ccfbf1] mb-10 font-medium">
              Nuestro equipo de expertos te ayuda a elegir los mejores productos
              para tu proyecto. Contáctanos y recibe atención personalizada.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0d9488] hover:bg-[#f0fdfa] font-bold px-8 py-6 text-lg hover:scale-105 transition-all duration-300 glow-aqua"
            >
              <Link href="/contacto">
                Contactar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * CategoryCardBento Component - Bento Grid Style
 */
interface CategoryCardBentoProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
  iconColor: string;
  span?: string;
}

function CategoryCardBento({ icon, title, description, href, gradient, iconColor, span }: CategoryCardBentoProps) {
  return (
    <Link href={href} className={`block group ${span || ''}`}>
      <div className={`h-full bg-gradient-to-br ${gradient} rounded-2xl p-8 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cursor-pointer border border-white/40 backdrop-blur-sm relative overflow-hidden`}>
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/30 to-transparent" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6 p-4 rounded-xl bg-white/50 backdrop-blur-sm w-fit" style={{ color: iconColor }}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-gray-700 font-medium mb-6 flex-1">
            {description}
          </p>
          <div className="flex items-center gap-2 text-gray-900 font-bold group-hover:gap-3 transition-all">
            Ver más
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: iconColor }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * BenefitCardPremium Component - With Gradients
 */
interface BenefitCardPremiumProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  gradient: string;
}

function BenefitCardPremium({ icon, title, description, iconColor, gradient }: BenefitCardPremiumProps) {
  return (
    <div className={`text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br ${gradient} border border-white/40 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer group`}>
      <div className="mx-auto w-20 h-20 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ color: iconColor }}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">
        {title}
      </h3>
      <p className="text-gray-700 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
