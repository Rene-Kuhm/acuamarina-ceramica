'use client';

import { use } from 'react';
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState('');

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

  const handleUpdateStatus = () => {
    if (!selectedStatus || !data?.data) return;
    updateStatus.mutate({ id: data.data.id, status: selectedStatus as any });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Pedido no encontrado
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Pedido {order.order_number}</h1>
            <p className="text-muted-foreground">
              Creado el {new Date(order.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cambiar Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              <option value="">Seleccionar estado...</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <Button
              onClick={handleUpdateStatus}
              disabled={!selectedStatus || updateStatus.isPending}
              className="w-full"
            >
              {updateStatus.isPending ? 'Actualizando...' : 'Actualizar Estado'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">{order.customer_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{order.customer_email || 'N/A'}</p>
            </div>
            {order.customer_phone && (
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount ?? 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dirección de Envío</CardTitle>
          </CardHeader>
          <CardContent>
            {typeof order.shipping_address === 'string' ? (
              <p className="whitespace-pre-line">{order.shipping_address}</p>
            ) : order.shipping_address && typeof order.shipping_address === 'object' ? (
              <div className="space-y-1">
                {order.shipping_address.street && <p>{order.shipping_address.street}</p>}
                {order.shipping_address.city && order.shipping_address.state && (
                  <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                )}
                {order.shipping_address.zipCode && <p>{order.shipping_address.zipCode}</p>}
                {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay dirección de envío</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Método de pago</p>
              <p className="font-medium">{order.payment_method}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado del pago</p>
              <p className="font-medium">{getPaymentStatusLabel(order.payment_status)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Producto</th>
                  <th className="text-right py-3 px-4 font-medium">Cantidad</th>
                  <th className="text-right py-3 px-4 font-medium">Precio Unitario</th>
                  <th className="text-right py-3 px-4 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.product_name}</td>
                      <td className="py-3 px-4 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.price ?? item.product_price ?? 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(item.subtotal ?? 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay productos en este pedido
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
