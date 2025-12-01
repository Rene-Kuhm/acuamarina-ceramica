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
    setMounted(true);
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  // Loading State
  if (!mounted || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          {/* Animated Logo Loader */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 opacity-20 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 opacity-40 animate-pulse animation-delay-150" />
            <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Aguamarina
          </h2>
          <p className="text-sm text-slate-500">
            Cargando dashboard...
          </p>
          {/* Progress Bar */}
          <div className="mt-6 w-48 h-1 bg-slate-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full animate-shimmer" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:block flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-mesh-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
