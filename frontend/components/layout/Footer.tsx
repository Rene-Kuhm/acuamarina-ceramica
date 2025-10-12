import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content - 4 columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 text-white font-bold text-xl">
                A
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                Aguamarina Mosaicos
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu tienda de confianza para cerámicos de alta calidad.
              Transformamos espacios con diseño y elegancia.
            </p>
            <p className="text-sm font-medium text-foreground">
              Calidad y estilo en cada pieza
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Información
            </h3>
            <ul className="space-y-2">
              {footerLinks.information.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                <a
                  href="mailto:info@acuamarina.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
                >
                  info@acuamarina.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                <a
                  href="tel:+541123456789"
                  className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
                >
                  +54 telefono
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Av. Ejemplo 1234
                  <br />
                  ejemplo, Argentina
                </span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-3">
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
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600/10 text-cyan-600 transition-colors hover:bg-cyan-600 hover:text-white"
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
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Aguamarina Mosaicos. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/terminos"
              className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
            >
              Términos
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/privacidad"
              className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
            >
              Privacidad
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/cookies"
              className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
