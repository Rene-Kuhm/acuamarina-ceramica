'use client';

import { Bell, Search, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MobileSidebar } from './MobileSidebar';

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center gap-4 px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar productos, pedidos, clientes..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-100"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hover:bg-slate-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </Button>

          {/* User Menu */}
          <Button variant="ghost" className="gap-2 hover:bg-slate-100">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900">{user?.firstName}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
