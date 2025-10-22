'use client';

import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useMemo } from 'react';

function StatCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Skeleton className="h-16 w-full" />
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
      title: 'TOTAL VENTAS',
      subtitle: 'Lorem Ipsum',
      value: formatCurrency(dashboardData?.stats.monthly_revenue || 0),
      icon: DollarSign,
      change: '+12.5%',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/20',
      href: '/dashboard/orders',
    },
    {
      title: 'VENTAS DIARIAS',
      subtitle: 'Lorem Ipsum',
      value: '$750',
      icon: ShoppingCart,
      change: '+8.3%',
      gradient: 'from-cyan-400 to-cyan-500',
      iconBg: 'bg-cyan-400/20',
      href: '/dashboard/orders',
    },
    {
      title: 'PEDIDOS TOTALES',
      subtitle: 'Lorem Ipsum',
      value: '$5,450',
      icon: Package,
      change: '+18.2%',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/20',
      href: '/dashboard/products',
    },
  ], [dashboardData]);

  // Calcular porcentaje para el gráfico circular
  const completionPercentage = 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">Analytics</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.gradient} text-white hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className={`w-12 h-12 rounded-xl ${stat.iconBg} backdrop-blur-sm flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold opacity-90 tracking-wide">{stat.title}</p>
                            <p className="text-[10px] opacity-70">{stat.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                          <div className="flex items-center gap-1 text-xs font-medium">
                            <TrendingUp className="w-3 h-3" />
                            <span>{stat.change}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Reports Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Reports</h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Circular Progress Chart */}
            <Card className="border-slate-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* SVG Circular Progress */}
                  <div className="relative w-48 h-48">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e2e8f0"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - completionPercentage / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#0d9488" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-slate-800">{completionPercentage}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-sm font-bold text-[#14b8a6] mb-1">LOREM IPSUM</h3>
                    <p className="text-xs text-slate-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Area Chart Placeholder */}
            <Card className="border-slate-200 shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">Ventas Mensuales</h3>
                  </div>

                  {/* Simple area chart mockup */}
                  <div className="relative h-64 bg-gradient-to-b from-[#14b8a6]/10 to-transparent rounded-lg">
                    <div className="absolute inset-0 flex items-end justify-around p-4">
                      {[40, 65, 45, 80, 60, 90, 55, 75, 50, 85, 70, 95].map((height, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div
                            className="w-8 bg-gradient-to-t from-[#14b8a6] to-[#5eead4] rounded-t-md transition-all duration-500 hover:opacity-80"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-2 right-4 flex gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
                        <span className="text-slate-600">Lorem Ipsum dolor</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-600">Lorem Ipsum dolor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        {!isLoading && dashboardData && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Productos</p>
                    <p className="text-2xl font-bold text-slate-800">{dashboardData.stats.total_products}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Clientes</p>
                    <p className="text-2xl font-bold text-slate-800">{dashboardData.stats.total_customers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Pedidos</p>
                    <p className="text-2xl font-bold text-slate-800">{dashboardData.stats.monthly_orders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Stock Bajo</p>
                    <p className="text-2xl font-bold text-slate-800">{dashboardData.lowStockProducts?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-amber-600" />
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
