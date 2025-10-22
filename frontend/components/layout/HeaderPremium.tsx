"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function HeaderPremium() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-200"
            : "bg-white"
        }`}
      >
        <nav className="container-premium">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-70 transition-opacity"
            >
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src="/logo-aguamarina.png"
                  alt="Aguamarina"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:inline-block font-semibold text-lg tracking-tight text-black">
                Aguamarina
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors link-underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              {mounted && (
                <div className="hidden lg:block">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="w-48 pl-9 h-9 bg-gray-100 border-0 focus:bg-gray-200 focus:ring-0 rounded-full text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>
              )}

              {/* Icons */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-gray-100 rounded-full"
                asChild
              >
                <Link href={isAuthenticated ? "/cuenta" : "/auth/login"}>
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">Usuario</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-gray-100 rounded-full relative"
                asChild
              >
                <Link href="/favoritos">
                  <Heart className="h-5 w-5 text-gray-700" />
                  {wishlistTotal > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 min-w-4 p-0 bg-black text-white text-[10px] rounded-full">
                      {wishlistTotal > 9 ? "9+" : wishlistTotal}
                    </Badge>
                  )}
                  <span className="sr-only">Favoritos</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-gray-100 rounded-full relative"
                asChild
              >
                <Link href="/carrito">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {totalItems > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 min-w-4 p-0 bg-black text-white text-[10px] rounded-full">
                      {totalItems > 9 ? "9+" : totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">Carrito</span>
                </Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 hover:bg-gray-100 rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700" />
                )}
                <span className="sr-only">Menú</span>
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-white md:hidden"
          >
            <div className="container-premium py-8">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    className="w-full pl-9 h-12 bg-gray-100 border-0 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="space-y-1 mb-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-2xl font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="border-t border-gray-200 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/cuenta"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-gray-600 hover:text-black"
                    >
                      Mi Cuenta
                    </Link>
                    <Link
                      href="/pedidos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-gray-600 hover:text-black"
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block py-2 text-sm text-gray-600 hover:text-black"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-gray-600 hover:text-black"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-gray-600 hover:text-black"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  );
}
