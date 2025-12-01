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
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';

function StatCardSkeleton() {
  return (
    <Card className="border-border/40">
      <CardContent className="p-6">
        <Skeleton className="h-24 w-full" />
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
      title: 'Ingresos Mensuales',
      value: formatCurrency(dashboardData?.stats?.monthlyRevenue ?? 0),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'emerald',
      href: '/dashboard/orders',
    },
    {
      title: 'Pedidos',
      value: dashboardData?.stats?.monthlyOrders ?? 0,
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'blue',
      href: '/dashboard/orders',
    },
    {
      title: 'Clientes',
      value: dashboardData?.stats?.totalCustomers ?? 0,
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'violet',
      href: '/dashboard/customers',
    },
    {
      title: 'Productos',
      value: dashboardData?.stats?.totalProducts ?? 0,
      change: '0%',
      changeType: 'neutral' as const,
      icon: Package,
      color: 'amber',
      href: '/dashboard/products',
    },
  ], [dashboardData]);

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500 text-white',
      blue: 'bg-blue-500 text-white',
      violet: 'bg-violet-500 text-white',
      amber: 'bg-amber-500 text-white',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen general de tu negocio
          </p>
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
              const ChangeIcon = stat.changeType === 'positive' ? ArrowUpRight : ArrowDownRight;

              return (
                <Link key={stat.title} href={stat.href} className="block">
                  <Card className="border-border/40 hover:border-border transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <div className="flex items-baseline space-x-2">
                            <p className="text-2xl font-bold tracking-tight">
                              {stat.value}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ChangeIcon className={`h-3 w-3 ${
                              stat.changeType === 'positive' ? 'text-emerald-600' :
                              stat.changeType === 'negative' ? 'text-red-600' :
                              'text-muted-foreground'
                            }`} />
                            <span className={`text-xs font-medium ${
                              stat.changeType === 'positive' ? 'text-emerald-600' :
                              stat.changeType === 'negative' ? 'text-red-600' :
                              'text-muted-foreground'
                            }`}>
                              {stat.change}
                            </span>
                            <span className="text-xs text-muted-foreground">vs mes anterior</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Charts Section */}
        {!isLoading && dashboardData && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Products */}
            {dashboardData.topProducts && dashboardData.topProducts.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Productos Más Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {dashboardData.topProducts.slice(0, 5).map((product, index) => {
                      const maxSales = dashboardData.topProducts?.[0]?.totalSales || 1;
                      const percentage = ((product.totalSales / maxSales) * 100).toFixed(0);

                      return (
                        <div key={product.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="font-medium">{product.name}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {product.totalSales} vendidos
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity / Alerts */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Estado del Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Low Stock Alert */}
                  {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-amber-900">
                            Stock Bajo Detectado
                          </p>
                          <p className="text-sm text-amber-700">
                            {dashboardData.lowStockProducts.length} productos requieren reabastecimiento
                          </p>
                          <Link
                            href="/dashboard/products"
                            className="text-sm font-medium text-amber-900 hover:text-amber-800 inline-flex items-center gap-1 mt-2"
                          >
                            Ver productos
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-900">
                            Inventario Saludable
                          </p>
                          <p className="text-sm text-emerald-700">
                            Todos los productos tienen stock adecuado
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats Summary */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Total Productos</span>
                      <span className="text-sm font-semibold">{dashboardData.stats.totalProducts}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Pedidos Mes Actual</span>
                      <span className="text-sm font-semibold">{dashboardData.stats.monthlyOrders}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Clientes Registrados</span>
                      <span className="text-sm font-semibold">{dashboardData.stats.totalCustomers}</span>
                    </div>
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
