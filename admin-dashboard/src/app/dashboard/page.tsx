'use client';

import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, DollarSign, ShoppingCart, Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';

// Skeleton para las tarjetas de estadísticas
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}

// Skeleton para las listas
function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-16 mb-1 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statsService.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });

  // Memoizar las estadísticas para evitar recalcular en cada render
  const stats = useMemo(() => [
    {
      title: 'Total Productos',
      value: dashboardData?.stats.total_products || 0,
      icon: Package,
      change: '+12.5%',
      changeType: 'positive' as const,
      bgColor: 'bg-[#f0fdfa] dark:bg-[#14b8a6]/10',
      iconColor: 'text-[#14b8a6] dark:text-[#2dd4bf]',
      borderColor: 'hover:border-l-[#14b8a6] dark:hover:border-l-[#2dd4bf]',
    },
    {
      title: 'Ventas del Mes',
      value: formatCurrency(dashboardData?.stats.monthly_revenue || 0),
      icon: DollarSign,
      change: '+18.2%',
      changeType: 'positive' as const,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-l-emerald-500 dark:hover:border-l-emerald-400',
    },
    {
      title: 'Pedidos del Mes',
      value: dashboardData?.stats.monthly_orders || 0,
      icon: ShoppingCart,
      change: '+10%',
      changeType: 'positive' as const,
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
      borderColor: 'hover:border-l-violet-500 dark:hover:border-l-violet-400',
    },
    {
      title: 'Total Clientes',
      value: dashboardData?.stats.total_customers || 0,
      icon: Users,
      change: '+8.3%',
      changeType: 'positive' as const,
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-l-amber-500 dark:hover:border-l-amber-400',
    },
  ], [dashboardData]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4" />
            <span className="hidden xs:inline">Bienvenido al panel de administración</span>
            <span className="xs:hidden">Panel de administración</span>
          </p>
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Grid con mejor diseño */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <Card
                key={stat.title}
                className={`hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent ${stat.borderColor} group`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-1.5 sm:p-2 rounded-xl ${stat.bgColor} transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {stat.change}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden xs:inline">
                      vs mes anterior
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Activity con mejor diseño */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-yellow-500 dark:border-t-yellow-400">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-br from-yellow-50/80 via-orange-50/50 to-white dark:from-yellow-950/20 dark:via-orange-950/10 dark:to-transparent dark:border-slate-700">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              Productos con Stock Bajo
            </CardTitle>
            {!isLoading && dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
              <span className="bg-yellow-500/20 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full ring-2 ring-yellow-500/30">
                {dashboardData.lowStockProducts.length}
              </span>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <ListSkeleton />
            ) : (
              <div className="space-y-3">
                {!dashboardData?.lowStockProducts || dashboardData.lowStockProducts.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30 mb-4 shadow-lg">
                      <Package className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">¡Todo en orden!</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No hay productos con stock bajo</p>
                  </div>
                ) : (
                  dashboardData.lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-0 group"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="font-semibold text-sm text-slate-800 dark:text-slate-200 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors truncate block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                          {product.stock_quantity} unidades
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Mín: {product.low_stock_threshold}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#14b8a6] dark:border-t-[#2dd4bf]">
          <CardHeader className="border-b bg-gradient-to-br from-[#f0fdfa]/80 via-[#ccfbf1]/50 to-white dark:from-[#14b8a6]/20 dark:via-[#0d9488]/10 dark:to-transparent dark:border-slate-700">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <div className="p-2 rounded-lg bg-[#ccfbf1] dark:bg-[#14b8a6]/30">
                <ShoppingCart className="h-5 w-5 text-[#14b8a6] dark:text-[#2dd4bf]" />
              </div>
              Últimos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <ListSkeleton />
            ) : (
              <div className="space-y-3">
                {!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] dark:from-[#14b8a6]/30 dark:to-[#0d9488]/30 mb-4 shadow-lg">
                      <ShoppingCart className="h-10 w-10 text-[#14b8a6] dark:text-[#2dd4bf]" />
                    </div>
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">No hay pedidos aún</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Los nuevos pedidos aparecerán aquí</p>
                  </div>
                ) : (
                  dashboardData.recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#f0fdfa]/50 dark:hover:bg-[#14b8a6]/20 transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-0 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm font-mono text-slate-800 dark:text-slate-200 group-hover:text-[#14b8a6] dark:group-hover:text-[#2dd4bf] transition-colors">
                          {order.order_number}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {order.customer_name || 'Cliente'}
                        </p>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${
                          order.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30' :
                          order.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/30' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
