"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  UserCircle,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/90">
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/logo-aguamarina.png"
                alt="Aguamarina Mosaicos"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Aguamarina Mosaicos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors text-gray-300 hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          {mounted && (
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-md"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-400 focus:border-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-300 hover:text-cyan-400">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="p-4">
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200" />
                    <Input
                      type="search"
                      placeholder="Buscar productos..."
                      className="w-full pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Cuenta de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name || "Usuario"}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/cuenta" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Mi Cuenta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/pedidos" className="cursor-pointer">
                        Mis Pedidos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Registrarse
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist Button */}
            <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-cyan-400" asChild>
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
                {wishlistTotal > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 p-0 text-xs hover:bg-pink-700"
                  >
                    {wishlistTotal > 99 ? "99+" : wishlistTotal}
                  </Badge>
                )}
                <span className="sr-only">Favoritos</span>
              </Link>
            </Button>

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-cyan-400" asChild>
              <Link href="/carrito">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 p-0 text-xs hover:bg-cyan-600"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
                <span className="sr-only">Carrito de compras</span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-cyan-400">
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                  <SheetDescription>
                    Navega por nuestra tienda
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                      <Input
                        type="search"
                        placeholder="Buscar productos..."
                        className="w-full pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile User Actions */}
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm font-medium">
                          {user?.name || "Usuario"}
                        </div>
                        <Link
                          href="/cuenta"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary"
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Mi Cuenta
                        </Link>
                        <Link
                          href="/pedidos"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary"
                        >
                          Mis Pedidos
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href="/auth/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Iniciar Sesión
                        </Link>
                        <Link
                          href="/auth/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary"
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Registrarse
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
