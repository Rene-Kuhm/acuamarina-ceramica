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

// Skeleton Components
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
        <div className="h-12 w-12 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-4 bg-slate-200 rounded" />
            <div className="flex-1 h-3 bg-slate-200 rounded" />
            <div className="h-3 w-16 bg-slate-200 rounded" />
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Resumen general de Aguamarina Ceramicos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-9 px-3 rounded-lg border-slate-200 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            asChild
            className="h-9 px-4 rounded-lg shadow-lg shadow-teal-500/25"
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
                <div className="stat-card bg-white rounded-2xl border border-slate-200/60 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/60 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                          isPositive ? 'text-emerald-600' :
                          isNegative ? 'text-red-600' :
                          'text-slate-500'
                        }`}>
                          {isPositive && <TrendingUp className="h-3 w-3" />}
                          {isNegative && <TrendingDown className="h-3 w-3" />}
                          {stat.change}
                        </span>
                        <span className="text-xs text-slate-400">
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
            <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-900">
                        Productos Mas Vendidos
                      </CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">Top 5 este mes</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50">
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
                              <p className="text-sm font-medium text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                                {product.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-slate-900">
                                {product.totalSales}
                              </p>
                              <p className="text-xs text-slate-500">vendidos</p>
                            </div>
                          </div>
                          <div className="ml-11 h-2 bg-slate-100 rounded-full overflow-hidden">
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
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">Sin datos de ventas</p>
                    <p className="text-xs text-slate-500 mt-1">Los productos mas vendidos apareceran aqui</p>
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
            <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900">
                      Estado del Inventario
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">Resumen rapido</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {/* Low Stock Alert */}
                {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amber-900">
                          Stock Bajo Detectado
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          {dashboardData.lowStockProducts.length} productos necesitan reabastecimiento
                        </p>
                        <Link
                          href="/dashboard/products"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 mt-2"
                        >
                          Ver productos
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-900">
                          Inventario Saludable
                        </p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          Todos los productos tienen stock adecuado
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-teal-600" />
                      </div>
                      <span className="text-sm text-slate-600">Total Productos</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {dashboardData?.stats.totalProducts ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-slate-600">Pedidos del Mes</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {dashboardData?.stats.monthlyOrders ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-sm text-slate-600">Clientes</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {dashboardData?.stats.totalCustomers ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Clock className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Acciones Rapidas
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Atajos frecuentes</p>
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
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                        <Icon className="h-4 w-4 text-slate-600 group-hover:text-teal-600 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors">
                        {action.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-teal-500 ml-auto transition-colors" />
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
        <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-100">
                  <ShoppingCart className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Actividad Reciente
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Ultimos pedidos y actividad</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                <Link href="/dashboard/orders">
                  Ver todos
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900">Sin actividad reciente</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Los pedidos recientes y actividad del sistema apareceran aqui
              </p>
              <Button variant="outline" size="sm" asChild className="mt-4">
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
