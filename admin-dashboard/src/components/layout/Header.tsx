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

      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 hover:text-[#14b8a6] hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar - Responsive */}
          <div className="hidden sm:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos, pedidos, clientes..."
                className="pl-10 text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]/20"
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
              className="sm:hidden text-gray-700 hover:text-[#14b8a6] hover:bg-gray-100"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-gray-700 hover:text-[#14b8a6] hover:bg-gray-100 relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#e15540] rounded-full ring-2 ring-white"></span>
            </Button>

            {/* User Menu */}
            <Button
              variant="ghost"
              className="gap-2 px-2 sm:px-3 text-gray-700 hover:bg-gray-100"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white text-xs font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-gray-900">{user?.firstName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
