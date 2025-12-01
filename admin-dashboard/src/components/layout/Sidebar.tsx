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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '../ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Productos', href: '/dashboard/products', icon: Package },
  { name: 'Categorias', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Pedidos', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Clientes', href: '/dashboard/customers', icon: Users },
  { name: 'Configuracion', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white border-r border-slate-200/80 transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        'flex items-center h-16 border-b border-slate-100',
        collapsed ? 'justify-center px-3' : 'justify-between px-4'
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/30 transition-shadow duration-300 overflow-hidden">
              <Image
                src="/logo/logo.png"
                alt="Aguamarina"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Aguamarina
              </h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          )}
        </Link>

        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Toggle Button (collapsed state) */}
      {collapsed && (
        <div className="flex justify-center py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {!collapsed && (
          <div className="px-3 mb-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu Principal
            </p>
          </div>
        )}

        {navigation.map((item, index) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed && 'justify-center px-2',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                'flex-shrink-0 transition-transform duration-200',
                collapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]',
                !isActive && 'group-hover:scale-110'
              )} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <Sparkles className="ml-auto h-3.5 w-3.5 opacity-60" />
                  )}
                </>
              )}

              {/* Active indicator for collapsed state */}
              {collapsed && isActive && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal-500 rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-100" />

      {/* User Section */}
      <div className="p-3">
        {!collapsed ? (
          <>
            {/* User Card */}
            <div className="mb-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.name || 'Administrador'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || 'admin@aguamarina.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2 h-10 px-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesion</span>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* Collapsed User Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            {/* Collapsed Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-10 w-10 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Cerrar Sesion"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
