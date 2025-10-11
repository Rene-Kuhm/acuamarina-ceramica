'use client';

import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Mail, Phone, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { exportService } from '@/services/export.service';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useCustomers({
    page,
    limit: 20,
    search: search || undefined,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportService.exportCustomers();
      toast.success('Clientes exportados correctamente');
    } catch (error) {
      toast.error('Error al exportar clientes');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestiona los clientes de la tienda</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exportando...' : 'Exportar CSV'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!data?.data || data.data.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No se encontraron clientes
            </CardContent>
          </Card>
        ) : (
          data.data.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">
                    {customer.first_name} {customer.last_name}
                  </span>
                  <Link href={`/dashboard/customers/${customer.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.company_name && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Empresa: </span>
                    <span className="font-medium">{customer.company_name}</span>
                  </div>
                )}
                <div className="pt-3 border-t grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Pedidos</p>
                    <p className="text-lg font-bold">{customer.total_orders || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Gastado</p>
                    <p className="text-lg font-bold">{formatCurrency(customer.total_spent || 0)}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Cliente desde {new Date(customer.created_at).toLocaleDateString('es-ES')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2">
            Página {page} de {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === data.pagination.totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
