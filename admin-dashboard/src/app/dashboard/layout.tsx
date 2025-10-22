'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    console.log('📱 Dashboard layout montado');
    setMounted(true);
    initialize();
  }, [initialize]);

  useEffect(() => {
    console.log('🔍 Verificando autenticación:', {
      mounted,
      isInitialized,
      isAuthenticated,
    });

    if (mounted && isInitialized && !isAuthenticated) {
      console.log('⚠️ No autenticado, redirigiendo a login...');
      router.push('/login');
    } else if (mounted && isInitialized && isAuthenticated) {
      console.log('✅ Usuario autenticado, mostrando dashboard');
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  if (!mounted || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#14b8a6]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
