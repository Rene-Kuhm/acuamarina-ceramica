'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MobileSidebar } from './MobileSidebar';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar productos, pedidos, clientes..."
                className="pl-10 h-10 w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-[#14b8a6] focus:ring-[#14b8a6] transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#e15540] rounded-full ring-2 ring-white"></span>
            </Button>

            {/* User Menu */}
            <Button
              variant="ghost"
              className="gap-2 px-3 text-slate-700 hover:bg-slate-100 hidden sm:flex"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-xs font-semibold text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-slate-900">{user?.firstName}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
