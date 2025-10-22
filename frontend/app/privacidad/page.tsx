export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Privacidad</h1>

      <div className="prose prose-cyan max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Información que Recopilamos</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Recopilamos información que nos proporcionas directamente cuando:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Creas una cuenta</li>
            <li>Realizas un pedido</li>
            <li>Te suscribes a nuestro boletín</li>
            <li>Nos contactas</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            Esta información puede incluir: nombre, dirección de correo electrónico, dirección postal,
            número de teléfono e información de pago.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Cómo Usamos tu Información</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Procesar y completar tus pedidos</li>
            <li>Enviarte confirmaciones y actualizaciones de pedidos</li>
            <li>Responder a tus consultas y solicitudes</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Enviarte información promocional (si has dado tu consentimiento)</li>
            <li>Prevenir fraudes y actividades ilegales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Compartir Información</h2>
          <p className="text-gray-600 leading-relaxed">
            No vendemos, alquilamos ni compartimos tu información personal con terceros para fines de
            marketing. Podemos compartir tu información con:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
            <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
            <li>Empresas de envío para entregar tus pedidos</li>
            <li>Procesadores de pagos para completar transacciones</li>
            <li>Autoridades legales cuando sea requerido por ley</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Cookies y Tecnologías Similares</h2>
          <p className="text-gray-600 leading-relaxed">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio,
            analizar el tráfico y personalizar el contenido. Puedes configurar tu navegador para
            rechazar cookies, pero esto puede limitar algunas funcionalidades del sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Seguridad de los Datos</h2>
          <p className="text-gray-600 leading-relaxed">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
            personal contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún método de
            transmisión por Internet es 100% seguro.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Tus Derechos</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Tienes derecho a:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Acceder a tu información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de tu información</li>
            <li>Oponerte al procesamiento de tu información</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Retención de Datos</h2>
          <p className="text-gray-600 leading-relaxed">
            Conservamos tu información personal durante el tiempo necesario para cumplir con los
            propósitos descritos en esta política, a menos que la ley requiera o permita un período
            de retención más largo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Menores de Edad</h2>
          <p className="text-gray-600 leading-relaxed">
            Nuestro sitio no está dirigido a menores de 18 años. No recopilamos intencionalmente
            información personal de menores.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Cambios en esta Política</h2>
          <p className="text-gray-600 leading-relaxed">
            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre
            cambios significativos publicando la nueva política en esta página y actualizando la
            fecha de &quot;última actualización&quot;.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Contacto</h2>
          <p className="text-gray-600 leading-relaxed">
            Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu
            información personal, contáctanos a través de nuestra página de contacto.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
          Última actualización: {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>
    </div>
  );
}
