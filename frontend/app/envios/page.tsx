import { Truck, Package, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function EnviosPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Envíos" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Información de Envíos
            </h1>
            <p className="text-lg text-gray-600">
              Conoce nuestras opciones de envío y tiempos de entrega
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-light rounded-full">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Envío Estándar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  <p className="mb-2"><strong>Tiempo de entrega:</strong> 5-7 días hábiles</p>
                  <p className="mb-2"><strong>Costo:</strong> Calculado según peso y destino</p>
                  <p>Ideal para compras regulares sin urgencia</p>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Envío Express</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  <p className="mb-2"><strong>Tiempo de entrega:</strong> 2-3 días hábiles</p>
                  <p className="mb-2"><strong>Costo:</strong> Recargo adicional</p>
                  <p>Para cuando necesitas tu pedido con urgencia</p>
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <CardTitle>Zonas de Cobertura</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Ciudad Autónoma de Buenos Aires (CABA)</h3>
                <p className="text-gray-600">Envío gratis en compras superiores a $50.000</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Gran Buenos Aires (GBA)</h3>
                <p className="text-gray-600">Envío desde $2.500 según zona</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Interior del país</h3>
                <p className="text-gray-600">Envío mediante transporte, costo según destino</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <CardTitle>Proceso de Envío</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
                  <span><strong>Confirmación del pedido:</strong> Recibirás un email con los detalles de tu compra</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
                  <span><strong>Preparación:</strong> Empacamos tu pedido con cuidado (1-2 días hábiles)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">3</span>
                  <span><strong>Despacho:</strong> Tu pedido sale hacia su destino</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">4</span>
                  <span><strong>Seguimiento:</strong> Recibirás el número de tracking para rastrear tu envío</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">5</span>
                  <span><strong>Entrega:</strong> ¡Tu pedido llega a destino!</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
