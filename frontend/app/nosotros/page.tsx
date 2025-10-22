import { Award, Heart, Shield, Users, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function NosotrosPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Nosotros" },
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-[#f0fdfa] to-white bg-clip-text text-transparent">
                Sobre Nosotros
              </span>
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Tu aliado de confianza en cerámicos y revestimientos de calidad
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Historia */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Nuestra Historia</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed text-gray-700">
              Aguamarina Mosaicos nació en 2010 con una visión clara: ofrecer productos cerámicos de la más alta calidad
              a precios accesibles. Desde nuestros humildes comienzos como una pequeña tienda familiar, hemos crecido
              hasta convertirnos en un referente en el mercado de cerámicos y revestimientos.
            </p>
            <p className="text-lg leading-relaxed mt-4 text-gray-700">
              Con más de 13 años de experiencia, hemos ayudado a miles de familias y profesionales a dar vida a sus
              proyectos, ofreciendo no solo productos excepcionales, sino también asesoramiento experto y un servicio
              al cliente incomparable.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Calidad</h3>
                <p className="text-gray-600">
                  Productos certificados de las mejores marcas internacionales
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Pasión</h3>
                <p className="text-gray-600">
                  Amamos lo que hacemos y se nota en cada detalle
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Confianza</h3>
                <p className="text-gray-600">
                  Garantía en todos nuestros productos y servicios
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Cercanía</h3>
                <p className="text-gray-600">
                  Trato personalizado y atención a tus necesidades
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Rapidez</h3>
                <p className="text-gray-600">
                  Entregas eficientes y puntuales en todo el país
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Compromiso</h3>
                <p className="text-gray-600">
                  Dedicados a tu satisfacción del principio al fin
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estadísticas - Aquamarina Style */}
        <div className="relative bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#2dd4bf] rounded-2xl p-12 text-white overflow-hidden">
          {/* Mesh gradient background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f0fdfa] rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">En Números</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-[#f0fdfa] bg-clip-text text-transparent">13+</div>
                <div className="text-white/90 font-medium">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-[#f0fdfa] bg-clip-text text-transparent">10k+</div>
                <div className="text-white/90 font-medium">Clientes satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-[#f0fdfa] bg-clip-text text-transparent">500+</div>
                <div className="text-white/90 font-medium">Productos disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-[#f0fdfa] bg-clip-text text-transparent">99%</div>
                <div className="text-white/90 font-medium">Satisfacción del cliente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
