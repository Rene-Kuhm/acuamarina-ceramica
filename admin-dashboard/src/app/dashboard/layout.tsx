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

  // Inicializar el auth store cuando se monta el componente
  useEffect(() => {
    console.log('📱 Dashboard layout montado');
    setMounted(true);
    initialize();
  }, [initialize]);

  // Redirigir a login solo después de que se haya inicializado
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

  // No renderizar nada hasta que esté montado e inicializado
  if (!mounted || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar solo visible en pantallas grandes (lg y superior) */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white relative">
          <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
