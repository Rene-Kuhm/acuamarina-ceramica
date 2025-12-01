'use client';

import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

// Skeleton Components - Dark Theme
function StatCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-8 w-32 bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-800 rounded" />
        </div>
        <div className="h-12 w-12 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-40 bg-zinc-800 rounded" />
        <div className="h-8 w-24 bg-zinc-800 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-4 bg-zinc-800 rounded" />
            <div className="flex-1 h-3 bg-zinc-800 rounded" />
            <div className="h-3 w-16 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statsService.getDashboard(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  type ChangeType = 'positive' | 'negative' | 'neutral';

  const stats = useMemo(() => [
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(dashboardData?.stats?.monthlyRevenue ?? 0),
      change: '+12.5%',
      changeType: 'positive' as ChangeType,
      icon: DollarSign,
      iconBg: 'bg-emerald-500',
      iconShadow: 'shadow-emerald-500/25',
      href: '/dashboard/orders',
      description: 'vs. mes anterior',
    },
    {
      title: 'Pedidos',
      value: dashboardData?.stats?.monthlyOrders ?? 0,
      change: '+8.2%',
      changeType: 'positive' as ChangeType,
      icon: ShoppingCart,
      iconBg: 'bg-blue-500',
      iconShadow: 'shadow-blue-500/25',
      href: '/dashboard/orders',
      description: 'este mes',
    },
    {
      title: 'Clientes',
      value: dashboardData?.stats?.totalCustomers ?? 0,
      change: '+3.1%',
      changeType: 'positive' as ChangeType,
      icon: Users,
      iconBg: 'bg-violet-500',
      iconShadow: 'shadow-violet-500/25',
      href: '/dashboard/customers',
      description: 'total registrados',
    },
    {
      title: 'Productos',
      value: dashboardData?.stats?.totalProducts ?? 0,
      change: '0%',
      changeType: 'neutral' as ChangeType,
      icon: Package,
      iconBg: 'bg-amber-500',
      iconShadow: 'shadow-amber-500/25',
      href: '/dashboard/products',
      description: 'en catalogo',
    },
  ], [dashboardData]);

  // Quick Actions
  const quickActions = [
    { label: 'Nuevo Producto', href: '/dashboard/products/new', icon: Package },
    { label: 'Ver Pedidos', href: '/dashboard/orders', icon: ShoppingCart },
    { label: 'Categorias', href: '/dashboard/categories', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Resumen general de Aguamarina Ceramicos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-9 px-3 rounded-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            asChild
            className="h-9 px-4 rounded-lg shadow-lg shadow-teal-500/20"
          >
            <Link href="/dashboard/products/new">
              <Package className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.changeType === 'positive';
            const isNegative = stat.changeType === 'negative';

            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="stat-card bg-zinc-900 rounded-2xl border border-zinc-800 p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 card-glow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-zinc-500">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                          isPositive ? 'text-emerald-400' :
                          isNegative ? 'text-red-400' :
                          'text-zinc-500'
                        }`}>
                          {isPositive && <TrendingUp className="h-3 w-3" />}
                          {isNegative && <TrendingDown className="h-3 w-3" />}
                          {stat.change}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {stat.description}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconShadow} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products - Takes 2 columns */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Card className="border-zinc-800 bg-zinc-900 shadow-lg shadow-black/10 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-white">
                        Productos Mas Vendidos
                      </CardTitle>
                      <p className="text-xs text-zinc-500 mt-0.5">Top 5 este mes</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
                    <Link href="/dashboard/products">
                      Ver todos
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
                  <div className="space-y-5">
                    {dashboardData.topProducts.slice(0, 5).map((product, index) => {
                      const maxSales = dashboardData.topProducts?.[0]?.totalSales || 1;
                      const percentage = Math.round((product.totalSales / maxSales) * 100);
                      const colors = [
                        'from-teal-500 to-teal-600',
                        'from-blue-500 to-blue-600',
                        'from-violet-500 to-violet-600',
                        'from-amber-500 to-amber-600',
                        'from-rose-500 to-rose-600',
                      ];

                      return (
                        <div key={product.id} className="group">
                          <div className="flex items-center gap-4 mb-2">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white bg-gradient-to-br ${colors[index]}`}>
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-teal-400 transition-colors">
                                {product.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-white">
                                {product.totalSales}
                              </p>
                              <p className="text-xs text-zinc-500">vendidos</p>
                            </div>
                          </div>
                          <div className="ml-11 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-700 ease-out`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-zinc-600" />
                    </div>
                    <p className="text-sm font-medium text-white">Sin datos de ventas</p>
                    <p className="text-xs text-zinc-500 mt-1">Los productos mas vendidos apareceran aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Inventory Status & Quick Actions */}
        <div className="space-y-6">
          {/* Inventory Status */}
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Card className="border-zinc-800 bg-zinc-900 shadow-lg shadow-black/10 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <BarChart3 className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-white">
                      Estado del Inventario
                    </CardTitle>
                    <p className="text-xs text-zinc-500 mt-0.5">Resumen rapido</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {/* Low Stock Alert */}
                {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amber-300">
                          Stock Bajo Detectado
                        </p>
                        <p className="text-xs text-amber-400/70 mt-0.5">
                          {dashboardData.lowStockProducts.length} productos necesitan reabastecimiento
                        </p>
                        <Link
                          href="/dashboard/products"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 mt-2"
                        >
                          Ver productos
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-300">
                          Inventario Saludable
                        </p>
                        <p className="text-xs text-emerald-400/70 mt-0.5">
                          Todos los productos tienen stock adecuado
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                        <Package className="h-4 w-4 text-teal-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Total Productos</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {dashboardData?.stats.totalProducts ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Pedidos del Mes</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {dashboardData?.stats.monthlyOrders ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-violet-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Clientes</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {dashboardData?.stats.totalCustomers ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-zinc-800 bg-zinc-900 shadow-lg shadow-black/10 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Clock className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    Acciones Rapidas
                  </CardTitle>
                  <p className="text-xs text-zinc-500 mt-0.5">Atajos frecuentes</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-teal-500/10 border border-zinc-800 hover:border-teal-500/30 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-colors">
                        <Icon className="h-4 w-4 text-zinc-400 group-hover:text-teal-400 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-teal-300 transition-colors">
                        {action.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-teal-400 ml-auto transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Section */}
      {!isLoading && dashboardData && (
        <Card className="border-zinc-800 bg-zinc-900 shadow-lg shadow-black/10 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                  <ShoppingCart className="h-4 w-4 text-teal-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    Actividad Reciente
                  </CardTitle>
                  <p className="text-xs text-zinc-500 mt-0.5">Ultimos pedidos y actividad</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
                <Link href="/dashboard/orders">
                  Ver todos
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-zinc-600" />
              </div>
              <p className="text-sm font-medium text-white">Sin actividad reciente</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Los pedidos recientes y actividad del sistema apareceran aqui
              </p>
              <Button variant="outline" size="sm" asChild className="mt-4 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                <Link href="/dashboard/orders">
                  Ir a Pedidos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
