import { Cookie, Shield, Settings, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function CookiesPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Política de Cookies" },
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mb-4">
              <Cookie className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Política de Cookies
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: Enero 2025
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>¿Qué son las cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 space-y-4">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia de navegación y proporcionar funcionalidades personalizadas.
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                <CardTitle>Tipos de Cookies que Utilizamos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Cookies Esenciales</h3>
                <p className="text-gray-600">
                  Son necesarias para el funcionamiento básico del sitio. Incluyen cookies de sesión para mantener tu carrito de compras y tu estado de autenticación.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Cookies de Rendimiento</h3>
                <p className="text-gray-600">
                  Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio, recopilando información de forma anónima sobre las páginas visitadas y errores encontrados.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Cookies de Funcionalidad</h3>
                <p className="text-gray-600">
                  Permiten que el sitio recuerde tus preferencias (como idioma, región, productos favoritos) para ofrecerte una experiencia más personalizada.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Cookies de Marketing</h3>
                <p className="text-gray-600">
                  Se utilizan para mostrar anuncios relevantes. Pueden ser establecidas por nuestros socios publicitarios a través de nuestro sitio.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary" />
                <CardTitle>Cookies Específicas que Usamos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Cookie</th>
                      <th className="text-left p-3 font-semibold">Propósito</th>
                      <th className="text-left p-3 font-semibold">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">auth_token</td>
                      <td className="p-3">Mantener tu sesión iniciada</td>
                      <td className="p-3">7 días</td>
                    </tr>
                    <tr>
                      <td className="p-3">cart_storage</td>
                      <td className="p-3">Guardar productos en tu carrito</td>
                      <td className="p-3">Persistente</td>
                    </tr>
                    <tr>
                      <td className="p-3">wishlist_storage</td>
                      <td className="p-3">Guardar tus productos favoritos</td>
                      <td className="p-3">Persistente</td>
                    </tr>
                    <tr>
                      <td className="p-3">theme_preference</td>
                      <td className="p-3">Recordar tu preferencia de tema</td>
                      <td className="p-3">Persistente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <CardTitle>Control de Cookies</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 space-y-4">
                <p>
                  Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya están en tu dispositivo y configurar la mayoría de los navegadores para que no se instalen.
                </p>
                <p>
                  <strong>Cómo gestionar cookies en tu navegador:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                  <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                  <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                  <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  Ten en cuenta que si deshabilitas las cookies, algunas funcionalidades del sitio pueden no funcionar correctamente.
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cambios en Esta Política</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600">
                <p>
                  Podemos actualizar esta política de cookies ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página.
                </p>
                <p className="mt-4">
                  <strong>Última actualización:</strong> Enero 2025
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
