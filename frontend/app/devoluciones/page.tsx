import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DevolucionesPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Devoluciones" },
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
              Política de Devoluciones
            </h1>
            <p className="text-lg text-gray-600">
              Tu satisfacción es nuestra prioridad
            </p>
          </div>

          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Importante:</strong> Tienes 30 días corridos desde la recepción del pedido para solicitar una devolución.
            </AlertDescription>
          </Alert>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <CardTitle>Productos Admitidos para Devolución</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Productos en su embalaje original sin abrir</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Cerámicos sin usar, sin cortes ni roturas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Productos con todos sus accesorios y documentación</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Productos que no presenten señales de instalación</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <CardTitle>No Se Admiten Devoluciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Productos ya instalados o colocados</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Cerámicos cortados o con señales de uso</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Productos personalizados o fabricados bajo pedido</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Productos en oferta o liquidación (salvo defecto de fábrica)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-primary" />
                <CardTitle>Proceso de Devolución</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
                  <span><strong>Contacta con nosotros:</strong> Envía un email a ventas@aguamarina-mosaicos.com con tu número de pedido</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
                  <span><strong>Espera nuestra respuesta:</strong> Te enviaremos las instrucciones en 24-48 horas hábiles</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">3</span>
                  <span><strong>Prepara el producto:</strong> Empaca el producto con su embalaje original</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">4</span>
                  <span><strong>Envío:</strong> Coordinaremos la recolección o punto de entrega</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">5</span>
                  <span><strong>Reembolso:</strong> Una vez recibido y verificado, procesaremos tu reembolso en 5-10 días hábiles</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Defectos de Fábrica</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 space-y-4">
                <p>
                  Si el producto presenta defectos de fábrica, tienes derecho a cambio o devolución sin costo adicional.
                </p>
                <p>
                  <strong>Pasos a seguir:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Toma fotografías claras del defecto</li>
                  <li>Envíanos las fotos junto con tu número de pedido</li>
                  <li>Nuestro equipo evaluará el caso en 24 horas</li>
                  <li>Te enviaremos un producto de reemplazo o procesaremos el reembolso</li>
                </ol>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
