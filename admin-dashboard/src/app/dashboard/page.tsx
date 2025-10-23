'use client';

import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats.service';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Sparkles,
  Leaf,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';

function StatCardSkeleton() {
  return (
    <Card className="overflow-hidden border-[#f5f3ef]">
      <CardContent className="p-6">
        <Skeleton className="h-24 w-full bg-[#f5f3ef]" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statsService.getDashboard(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const stats = useMemo(() => [
    {
      title: 'Ventas del Mes',
      subtitle: 'Ingresos totales',
      value: formatCurrency(dashboardData?.stats.monthly_revenue || 0),
      icon: DollarSign,
      bgColor: 'bg-gradient-to-br from-[#4dd0e1]/10 via-[#4dd0e1]/5 to-transparent',
      iconColor: 'text-[#4dd0e1]',
      iconBg: 'bg-[#4dd0e1]/10',
      href: '/dashboard/orders',
    },
    {
      title: 'Stock Actual',
      subtitle: 'Productos en inventario',
      value: dashboardData?.stats.total_products || 0,
      icon: Package,
      bgColor: 'bg-gradient-to-br from-[#a3b18a]/10 via-[#a3b18a]/5 to-transparent',
      iconColor: 'text-[#a3b18a]',
      iconBg: 'bg-[#a3b18a]/10',
      href: '/dashboard/products',
    },
    {
      title: 'Pedidos Activos',
      subtitle: 'Este mes',
      value: dashboardData?.stats.monthly_orders || 0,
      icon: ShoppingCart,
      bgColor: 'bg-gradient-to-br from-[#7a7a7a]/10 via-[#7a7a7a]/5 to-transparent',
      iconColor: 'text-[#7a7a7a]',
      iconBg: 'bg-[#7a7a7a]/10',
      href: '/dashboard/orders',
    },
    {
      title: 'Total Clientes',
      subtitle: 'Registrados',
      value: dashboardData?.stats.total_customers || 0,
      icon: Users,
      bgColor: 'bg-gradient-to-br from-[#4dd0e1]/10 via-[#4dd0e1]/5 to-transparent',
      iconColor: 'text-[#4dd0e1]',
      iconBg: 'bg-[#4dd0e1]/10',
      href: '/dashboard/customers',
    },
  ], [dashboardData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ef] via-white to-[#e8f4f8]">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header con estilo artesanal */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4dd0e1]/5 via-transparent to-[#a3b18a]/5 rounded-2xl blur-2xl"></div>
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#4dd0e1]/20 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4dd0e1] to-[#4dd0e1]/70 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#333333]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Bienvenido a Aguamarina
                </h1>
                <p className="text-sm text-[#7a7a7a]">Panel de administración artesanal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid con diseño artesanal */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className={`overflow-hidden border-[#f5f3ef] hover:border-[#4dd0e1]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${stat.bgColor}`}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Icon */}
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                          </div>
                        </div>

                        {/* Contenido */}
                        <div>
                          <h3 className="text-sm font-medium text-[#7a7a7a] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {stat.title}
                          </h3>
                          <p className="text-3xl font-bold text-[#333333] mb-1">
                            {stat.value}
                          </p>
                          <p className="text-xs text-[#7a7a7a]/70">{stat.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Sección de gráficos artesanales */}
        {!isLoading && dashboardData && dashboardData.topProducts && dashboardData.topProducts.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Productos más vendidos */}
            <Card className="border-[#f5f3ef] shadow-md bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#4dd0e1]/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#4dd0e1]" />
                  </div>
                  <h3 className="text-base font-bold text-[#333333]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Productos más vendidos
                  </h3>
                </div>

                <div className="space-y-4">
                  {dashboardData.topProducts.slice(0, 4).map((product) => {
                    const maxSales = dashboardData.topProducts?.[0]?.totalSales || 1;
                    const percentage = ((product.totalSales / maxSales) * 100).toFixed(0);

                    return (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#333333]">{product.name}</span>
                            <span className="text-sm font-bold text-[#4dd0e1]">{percentage}%</span>
                          </div>
                          <div className="h-2 bg-[#f5f3ef] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#4dd0e1] to-[#4dd0e1]/70 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Espacio para futuro gráfico de ventas */}
            <Card className="border-[#f5f3ef] shadow-md bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#a3b18a]/10 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#a3b18a]" />
                  </div>
                  <h3 className="text-base font-bold text-[#333333]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Estadísticas de ventas
                  </h3>
                </div>

                <div className="flex items-center justify-center h-64 text-[#7a7a7a]">
                  <p className="text-sm">Datos de ventas mensuales próximamente</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tarjetas informativas adicionales */}
        {!isLoading && dashboardData && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total clientes */}
            <Card className="border-[#f5f3ef] bg-gradient-to-br from-white to-[#4dd0e1]/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#7a7a7a] mb-1">Total Clientes</p>
                    <p className="text-3xl font-bold text-[#333333]">{dashboardData.stats.total_customers}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4dd0e1] to-[#4dd0e1]/70 flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productos con stock bajo */}
            <Card className="border-[#f5f3ef] bg-gradient-to-br from-white to-amber-50/30 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#7a7a7a] mb-1">Alerta de Stock</p>
                    <p className="text-3xl font-bold text-[#333333]">{dashboardData.lowStockProducts?.length || 0}</p>
                    <p className="text-xs text-amber-600 mt-1">Requiere atención</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total productos */}
            <Card className="border-[#f5f3ef] bg-gradient-to-br from-white to-[#a3b18a]/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#7a7a7a] mb-1">Total Productos</p>
                    <p className="text-3xl font-bold text-[#333333]">{dashboardData.stats.total_products}</p>
                    <p className="text-xs text-[#a3b18a] mt-1">En inventario</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a3b18a] to-[#a3b18a]/70 flex items-center justify-center shadow-lg">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
