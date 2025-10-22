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
      change: '+12.5%',
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
      change: '+8.3%',
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
      change: '+18.2%',
      bgColor: 'bg-gradient-to-br from-[#7a7a7a]/10 via-[#7a7a7a]/5 to-transparent',
      iconColor: 'text-[#7a7a7a]',
      iconBg: 'bg-[#7a7a7a]/10',
      href: '/dashboard/orders',
    },
    {
      title: 'Clientes Nuevos',
      subtitle: 'Últimos 30 días',
      value: Math.floor((dashboardData?.stats.total_customers || 0) * 0.15),
      icon: Users,
      change: '+15.7%',
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
                        {/* Icon y cambio */}
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            <TrendingUp className="w-3 h-3" />
                            {stat.change}
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
                {['Cerámica Artesanal', 'Aromaterapia Premium', 'Decoración en Vidrio', 'Hierro Forjado'].map((product, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#333333]">{product}</span>
                        <span className="text-sm font-bold text-[#4dd0e1]">{95 - i * 15}%</span>
                      </div>
                      <div className="h-2 bg-[#f5f3ef] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4dd0e1] to-[#4dd0e1]/70 rounded-full transition-all duration-1000"
                          style={{ width: `${95 - i * 15}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ventas mensuales con diseño orgánico */}
          <Card className="border-[#f5f3ef] shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#a3b18a]/10 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-[#a3b18a]" />
                </div>
                <h3 className="text-base font-bold text-[#333333]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Evolución de ventas
                </h3>
              </div>

              {/* Gráfico de área suave */}
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end justify-around gap-1">
                  {[45, 62, 48, 75, 58, 82, 50, 70, 55, 85, 68, 92].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-gradient-to-t from-[#4dd0e1] via-[#4dd0e1]/80 to-[#4dd0e1]/60 rounded-t-lg transition-all duration-500 hover:opacity-90 cursor-pointer shadow-sm"
                          style={{ height: `${height * 2.5}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#333333] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            ${(height * 100).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#7a7a7a] mt-2">
                        {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leyenda */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[#f5f3ef]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4dd0e1]"></div>
                  <span className="text-xs text-[#7a7a7a]">Ventas actuales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#a3b18a]"></div>
                  <span className="text-xs text-[#7a7a7a]">Objetivo mensual</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    <p className="text-xs text-[#a3b18a] mt-1">+24 esta semana</p>
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

            {/* Categoría Aromaterapia */}
            <Card className="border-[#f5f3ef] bg-gradient-to-br from-white to-[#a3b18a]/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#7a7a7a] mb-1">Aromaterapia</p>
                    <p className="text-3xl font-bold text-[#333333]">156</p>
                    <p className="text-xs text-[#a3b18a] mt-1">Productos activos</p>
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
