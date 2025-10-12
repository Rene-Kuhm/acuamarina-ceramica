'use client';

import { Bell, Search, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MobileSidebar } from './MobileSidebar';
import { useTheme } from '../theme/ThemeProvider';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { theme, toggle } = useTheme();

  return (
    <>
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
        <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden dark:text-slate-300 shrink-0"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

        {/* Search Bar - Oculta en móviles pequeños */}
        <div className="hidden sm:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              type="search"
              placeholder="Buscar productos, pedidos, clientes..."
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Spacer para móviles */}
        <div className="flex-1 sm:hidden" />

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search Button - Solo en móviles */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="h-5 w-5 dark:text-slate-300" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            onClick={toggle}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </Button>

          {/* Notifications - Ocultas en móviles muy pequeños */}
          <Button variant="ghost" size="icon" className="hidden xs:flex hover:bg-slate-100 dark:hover:bg-slate-800 relative shrink-0">
            <Bell className="h-5 w-5 dark:text-slate-300" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </Button>

          {/* User Menu */}
          <Button variant="ghost" className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 px-2 sm:px-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.firstName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
            </div>
          </Button>
        </div>
      </div>
    </header>
    </>
  );
}
