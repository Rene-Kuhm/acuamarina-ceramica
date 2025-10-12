import { Award, Heart, Shield, Users, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function NosotrosPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Nosotros" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-cyan-100" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-xl text-cyan-100 max-w-3xl">
            Tu aliado de confianza en cerámicos y revestimientos de calidad
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Historia */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestra Historia</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed">
              Aguamarina Mosaicos nació en 2010 con una visión clara: ofrecer productos cerámicos de la más alta calidad
              a precios accesibles. Desde nuestros humildes comienzos como una pequeña tienda familiar, hemos crecido
              hasta convertirnos en un referente en el mercado de cerámicos y revestimientos.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Con más de 13 años de experiencia, hemos ayudado a miles de familias y profesionales a dar vida a sus
              proyectos, ofreciendo no solo productos excepcionales, sino también asesoramiento experto y un servicio
              al cliente incomparable.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Calidad</h3>
                <p className="text-gray-600">
                  Productos certificados de las mejores marcas internacionales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pasión</h3>
                <p className="text-gray-600">
                  Amamos lo que hacemos y se nota en cada detalle
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Confianza</h3>
                <p className="text-gray-600">
                  Garantía en todos nuestros productos y servicios
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cercanía</h3>
                <p className="text-gray-600">
                  Trato personalizado y atención a tus necesidades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rapidez</h3>
                <p className="text-gray-600">
                  Entregas eficientes y puntuales en todo el país
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Compromiso</h3>
                <p className="text-gray-600">
                  Dedicados a tu satisfacción del principio al fin
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">En Números</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">13+</div>
              <div className="text-cyan-100">Años de experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-cyan-100">Clientes satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-cyan-100">Productos disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-cyan-100">Satisfacción del cliente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
