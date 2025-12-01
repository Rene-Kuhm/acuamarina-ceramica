'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Download, PackageX, Filter, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { exportService } from '@/services/export.service';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useOrders({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter as any || undefined,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportService.exportOrders({
        status: statusFilter || undefined,
      });
      toast.success('Pedidos exportados correctamente');
    } catch (error) {
      toast.error('Error al exportar pedidos');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      completed: 'Completado',
      failed: 'Fallido',
      refunded: 'Reembolsado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todos los pedidos de la tienda
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="border-[#14b8a6]/20 hover:bg-[#14b8a6]/10"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#14b8a6]" />
            <CardTitle className="text-lg">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por número de pedido..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-11"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#14b8a6]" />
              <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
            </div>
            {data?.data && (
              <Badge variant="secondary" className="font-mono">
                {data.data.length} pedidos
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 border-2 border-[#14b8a6] border-t-transparent rounded-full animate-spin" />
                Cargando pedidos...
              </div>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-12">
              <PackageX className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700">No hay pedidos</p>
              <p className="text-sm text-muted-foreground">
                Los pedidos aparecerán aquí cuando se realicen compras
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Número</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Pago</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((order) => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-mono font-semibold text-[#14b8a6]">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.shippingFirstName && order.shippingLastName
                            ? `${order.shippingFirstName} ${order.shippingLastName}`
                            : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.userId || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPaymentStatusBadgeColor(order.paymentStatus)}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="group-hover:bg-slate-100">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalle
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t bg-slate-50/50">
              <div className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * 20 + 1} - {Math.min(page * 20, data.pagination.total)} de {data.pagination.total} pedidos
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1 px-3">
                  <span className="text-sm font-medium">{page}</span>
                  <span className="text-sm text-muted-foreground">de</span>
                  <span className="text-sm font-medium">{data.pagination.totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
