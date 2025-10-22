'use client';

import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
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

      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-slate-900/90 shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-700 dark:text-slate-300 hover:text-[#14b8a6] hover:bg-[#f0fdfa] dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar - Responsive */}
          <div className="hidden sm:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar productos, pedidos, clientes..."
                className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-[#2dd4bf] transition-all"
              />
            </div>
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-slate-700 dark:text-slate-300 hover:text-[#14b8a6] hover:bg-[#f0fdfa] dark:hover:bg-slate-800"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-700 dark:text-slate-300 hover:text-[#14b8a6] hover:bg-[#f0fdfa] dark:hover:bg-slate-800"
              onClick={toggle}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-slate-700 dark:text-slate-300 hover:text-[#14b8a6] hover:bg-[#f0fdfa] dark:hover:bg-slate-800 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#e15540] rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </Button>

            {/* User Menu */}
            <Button
              variant="ghost"
              className="gap-2 px-2 sm:px-3 text-slate-700 dark:text-slate-300 hover:bg-[#f0fdfa] dark:hover:bg-slate-800"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white text-sm font-semibold shadow-md">
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
