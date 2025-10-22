'use client';

import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, DollarSign, ShoppingCart, Users, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';

// Skeleton para las tarjetas
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
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
      title: 'Total Productos',
      value: dashboardData?.stats.total_products || 0,
      icon: Package,
      change: '+12.5%',
      changeType: 'positive' as const,
      href: '/dashboard/products',
    },
    {
      title: 'Ventas del Mes',
      value: formatCurrency(dashboardData?.stats.monthly_revenue || 0),
      icon: DollarSign,
      change: '+18.2%',
      changeType: 'positive' as const,
      href: '/dashboard/orders',
    },
    {
      title: 'Pedidos del Mes',
      value: dashboardData?.stats.monthly_orders || 0,
      icon: ShoppingCart,
      change: '+10%',
      changeType: 'positive' as const,
      href: '/dashboard/orders',
    },
    {
      title: 'Total Clientes',
      value: dashboardData?.stats.total_customers || 0,
      icon: Users,
      change: '+8.3%',
      changeType: 'positive' as const,
      href: '/dashboard/customers',
    },
  ], [dashboardData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#f0fdfa]">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#14b8a6]/5 to-transparent rounded-lg blur-3xl"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Resumen general de tu tienda</p>
          </div>
        </div>

      {/* Stats Grid */}
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
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg hover:border-[#14b8a6]/50 transition-all duration-200 cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-[#14b8a6]/10 group-hover:bg-[#14b8a6]/20 transition-colors">
                      <Icon className="h-5 w-5 text-[#14b8a6]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-slate-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span className="font-medium text-emerald-600">{stat.change}</span>
                      <span className="text-slate-500">vs mes anterior</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>

        {/* Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Productos con Stock Bajo */}
        <Card className="col-span-1">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <CardTitle className="text-base font-semibold">Productos con Stock Bajo</CardTitle>
              </div>
              {!isLoading && dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {dashboardData.lowStockProducts.length}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : !dashboardData?.lowStockProducts || dashboardData.lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
                  <Package className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">¡Todo en orden!</p>
                <p className="text-sm text-slate-500 mt-1">No hay productos con stock bajo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/dashboard/products/${product.id}/edit`}
                    className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-[#14b8a6]">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-semibold text-amber-600">
                        {product.stock_quantity} unidades
                      </p>
                      <p className="text-xs text-slate-500">Mín: {product.low_stock_threshold}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimos Pedidos */}
        <Card className="col-span-1">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#14b8a6]/10">
                  <ShoppingCart className="h-4 w-4 text-[#14b8a6]" />
                </div>
                <CardTitle className="text-base font-semibold">Últimos Pedidos</CardTitle>
              </div>
              <Link href="/dashboard/orders" className="text-sm font-medium text-[#14b8a6] hover:text-[#0d9488] flex items-center gap-1">
                Ver todos
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : !dashboardData?.recentOrders || dashboardData.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#14b8a6]/10 mb-3">
                  <ShoppingCart className="h-6 w-6 text-[#14b8a6]" />
                </div>
                <p className="text-sm font-medium text-slate-900">No hay pedidos aún</p>
                <p className="text-sm text-slate-500 mt-1">Los nuevos pedidos aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono font-medium text-slate-900 group-hover:text-[#14b8a6]">
                        #{order.order_number}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.customer_name || 'Cliente'}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
