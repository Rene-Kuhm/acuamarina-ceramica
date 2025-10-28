import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const footerLinks = {
  quickLinks: [
    { href: "/productos", label: "Productos" },
    { href: "/categorias", label: "Categorías" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ],
  information: [
    { href: "/envios", label: "Información de Envíos" },
    { href: "/devoluciones", label: "Política de Devoluciones" },
    { href: "/terminos", label: "Términos y Condiciones" },
    { href: "/privacidad", label: "Política de Privacidad" },
  ],
  socialMedia: [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      label: "Síguenos en Facebook",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      label: "Síguenos en Instagram",
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
      label: "Síguenos en Twitter",
    },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      {/* Newsletter Section - Aquamarina Style */}
      <div className="relative bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#2dd4bf] text-white overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f0fdfa] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2">
              Suscríbete a nuestro Newsletter
            </h2>
            <p className="text-white/90 mb-6">
              Recibe ofertas exclusivas, novedades y consejos para tus proyectos
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content - 4 columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="/logo-aguamarina.png"
                  alt="Aguamarina Mosaicos"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-[#14b8a6] via-[#0d9488] to-[#115e59] bg-clip-text text-transparent">
                Aguamarina Mosaicos
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              Tu tienda de confianza para cerámicos de alta calidad.
              Transformamos espacios con diseño y elegancia.
            </p>
            <p className="text-sm font-medium text-gray-900">
              Calidad y estilo en cada pieza
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-[#14b8a6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Información
            </h3>
            <ul className="space-y-2">
              {footerLinks.information.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-[#14b8a6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-0.5 text-[#14b8a6] flex-shrink-0" />
                <a
                  href="mailto:contacto@aguamarinamosaicos.com"
                  className="text-sm text-gray-600 transition-colors hover:text-[#14b8a6]"
                >
                  contacto@aguamarinamosaicos.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 mt-0.5 text-[#14b8a6] flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <a
                    href="https://wa.me/5492334404670"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#14b8a6] block"
                  >
                    WhatsApp: 2334-404670
                  </a>
                  <a
                    href="tel:+5492334404331"
                    className="transition-colors hover:text-[#14b8a6]"
                  >
                    Tel: 2334-404331
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-[#14b8a6] flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Local Comercial:</p>
                  <p>Av. Buccino y Piquillines</p>
                  <p>Playas Doradas - Sierra Grande</p>
                  <p className="mt-1 text-xs">Lun-Dom: 09:00-13:30 | 17:00-23:00</p>
                </div>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Síguenos
              </p>
              <div className="flex space-x-3">
                {footerLinks.socialMedia.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0fdfa] text-[#14b8a6] transition-colors hover:bg-[#14b8a6] hover:text-white"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright Row */}
        <div className="flex flex-col items-center justify-between space-y-4 text-center sm:flex-row sm:space-y-0 sm:text-left">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Aguamarina Mosaicos. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/terminos"
              className="text-sm text-gray-600 transition-colors hover:text-[#14b8a6]"
            >
              Términos
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/privacidad"
              className="text-sm text-gray-600 transition-colors hover:text-[#14b8a6]"
            >
              Privacidad
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/cookies"
              className="text-sm text-gray-600 transition-colors hover:text-[#14b8a6]"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
