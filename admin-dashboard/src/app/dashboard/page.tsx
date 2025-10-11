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
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Ventas del Mes',
      value: formatCurrency(dashboardData?.stats.monthly_revenue || 0),
      icon: DollarSign,
      change: '+18.2%',
      changeType: 'positive' as const,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Pedidos del Mes',
      value: dashboardData?.stats.monthly_orders || 0,
      icon: ShoppingCart,
      change: '+10%',
      changeType: 'positive' as const,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Clientes',
      value: dashboardData?.stats.total_customers || 0,
      icon: Users,
      change: '+8.3%',
      changeType: 'positive' as const,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ], [dashboardData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header mejorado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4" />
            Bienvenido al panel de administración
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
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
                className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">
                      {stat.change}
                    </p>
                    <span className="text-xs text-muted-foreground">
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
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-yellow-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Productos con Stock Bajo
            </CardTitle>
            {!isLoading && dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
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
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">¡Todo bien!</p>
                    <p className="text-xs text-muted-foreground">No hay productos con stock bajo</p>
                  </div>
                ) : (
                  dashboardData.lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors border-b last:border-0"
                    >
                      <div className="flex-1">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="font-medium text-sm hover:text-blue-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">
                          {product.stock_quantity} unidades
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mínimo: {product.low_stock_threshold}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Últimos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <ListSkeleton />
            ) : (
              <div className="space-y-3">
                {!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-3">
                      <ShoppingCart className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">No hay pedidos recientes</p>
                    <p className="text-xs text-muted-foreground">Los nuevos pedidos aparecerán aquí</p>
                  </div>
                ) : (
                  dashboardData.recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors border-b last:border-0 group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm font-mono group-hover:text-blue-600 transition-colors">
                          {order.order_number}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.customer_name || 'Cliente'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
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
