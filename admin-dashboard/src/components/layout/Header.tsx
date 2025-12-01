'use client';

import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MobileSidebar } from './MobileSidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Get current greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos dias';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <>
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <header className="sticky top-0 z-40 w-full bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0 h-10 w-10 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Greeting - Desktop Only */}
            <div className="hidden lg:block">
              <p className="text-sm text-zinc-500">{getGreeting()},</p>
              <h2 className="text-base font-semibold text-white -mt-0.5">
                {user?.name?.split(' ')[0] || 'Admin'}
              </h2>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md lg:ml-8">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
                <Input
                  type="search"
                  placeholder="Buscar productos, pedidos..."
                  className="pl-10 h-10 w-full bg-zinc-800 border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-500 focus:bg-zinc-800 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all"
                  disabled
                />
                <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 h-5 px-1.5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 text-[10px] font-medium text-zinc-500">
                  <span className="text-xs">Cmd</span>K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Help Button - Desktop Only */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-10 w-10 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              title="Ayuda"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-zinc-900" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 bg-zinc-900 border-zinc-800">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <h3 className="font-semibold text-white">Notificaciones</h3>
                  <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    3 nuevas
                  </span>
                </div>
                <div className="py-2">
                  {/* Notification Items */}
                  <div className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <ShoppingCartIcon className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200">Nuevo pedido #1234</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Hace 5 minutos</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <PackageIcon className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200">Stock bajo en 3 productos</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Hace 1 hora</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200">Nuevo cliente registrado</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Hace 2 horas</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-zinc-800 p-2">
                  <Button variant="ghost" className="w-full h-9 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg">
                    Ver todas las notificaciones
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Separator */}
            <div className="hidden sm:block w-px h-6 bg-zinc-800 mx-1" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 h-10 pl-2 pr-3 rounded-xl text-zinc-300 hover:bg-zinc-800 flex-shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
                    {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-tight capitalize">
                      {user?.role || 'Administrador'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-500 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white">
                      {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem disabled className="cursor-not-allowed opacity-50 text-zinc-400 focus:bg-zinc-800 focus:text-zinc-400">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                  <span className="ml-auto text-[10px] text-zinc-600">Pronto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuracion</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="cursor-not-allowed opacity-50 text-zinc-400 focus:bg-zinc-800 focus:text-zinc-400">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Ayuda</span>
                  <span className="ml-auto text-[10px] text-zinc-600">Pronto</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

// Mini icon components for notifications
function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
