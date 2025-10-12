'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '../ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Productos', href: '/dashboard/products', icon: Package },
  { name: 'Categorías', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Pedidos', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Clientes', href: '/dashboard/customers', icon: Users },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-full w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-black text-white shadow-2xl">
      {/* Logo Section - Premium */}
      <div className="p-6 border-b border-slate-800/50 dark:border-slate-900/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 rounded-full"></div>
            <div className="relative h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform overflow-hidden">
              <Image
                src="/logo/logo.png"
                alt="Aguamarina Mosaicos Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Aguamarina
            </h1>
            <p className="text-xs text-slate-400 font-medium">Mosaicos Premium</p>
          </div>
        </div>
        <div className="mt-3 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <p className="text-xs text-cyan-400 font-medium">Panel de Administración</p>
        </div>
      </div>

      {/* Navigation - Premium */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-r-full"></div>
              )}

              <div className="flex items-center gap-3 z-10">
                <div className={cn(
                  'p-2 rounded-lg transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg'
                    : 'bg-slate-800/50 group-hover:bg-slate-700'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span>{item.name}</span>
              </div>

              <ChevronRight className={cn(
                'h-4 w-4 transition-all duration-300',
                isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              )} />
            </Link>
          );
        })}
      </nav>

      {/* User Section - Premium */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="mb-3 p-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 blur-md opacity-50 rounded-full"></div>
              <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-slate-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:text-red-400 transition-colors" />
          <span className="group-hover:text-red-400 transition-colors">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}
