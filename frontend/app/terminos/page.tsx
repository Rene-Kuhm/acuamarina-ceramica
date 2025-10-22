export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Términos de Servicio</h1>

      <div className="prose prose-cyan max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Aceptación de los Términos</h2>
          <p className="text-gray-600 leading-relaxed">
            Al acceder y utilizar este sitio web, aceptas cumplir con estos términos de servicio,
            todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento
            de las leyes locales aplicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Uso del Sitio</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Este sitio web está destinado para uso personal y comercial relacionado con la compra
            de productos cerámicos. No está permitido:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Usar el sitio para cualquier propósito ilegal</li>
            <li>Intentar acceder a áreas no autorizadas del sitio</li>
            <li>Interferir con el funcionamiento del sitio</li>
            <li>Copiar o distribuir contenido sin autorización</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Productos y Precios</h2>
          <p className="text-gray-600 leading-relaxed">
            Nos esforzamos por proporcionar información precisa sobre productos y precios. Sin embargo,
            nos reservamos el derecho de corregir errores, inexactitudes u omisiones, incluso después
            de haber recibido un pedido.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Pedidos y Pagos</h2>
          <p className="text-gray-600 leading-relaxed">
            Todos los pedidos están sujetos a disponibilidad y confirmación del precio. Nos reservamos
            el derecho de rechazar cualquier pedido por cualquier motivo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Envíos y Devoluciones</h2>
          <p className="text-gray-600 leading-relaxed">
            Consulta nuestra política de envíos y devoluciones para obtener información detallada
            sobre plazos de entrega, costos de envío y condiciones para devoluciones.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Propiedad Intelectual</h2>
          <p className="text-gray-600 leading-relaxed">
            Todo el contenido de este sitio, incluyendo texto, gráficos, logos, imágenes y software,
            es propiedad de Aguamarina Mosaicos y está protegido por las leyes de derechos de autor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Limitación de Responsabilidad</h2>
          <p className="text-gray-600 leading-relaxed">
            Aguamarina Mosaicos no será responsable de ningún daño directo, indirecto, incidental o
            consecuente que resulte del uso o la imposibilidad de usar este sitio web.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Modificaciones</h2>
          <p className="text-gray-600 leading-relaxed">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
            entrarán en vigencia inmediatamente después de su publicación en el sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Contacto</h2>
          <p className="text-gray-600 leading-relaxed">
            Si tienes preguntas sobre estos términos, por favor contáctanos a través de nuestra
            página de contacto.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
          Última actualización: {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>
    </div>
  );
}
