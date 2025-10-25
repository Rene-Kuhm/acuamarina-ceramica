'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Package, DollarSign, Tag, Ruler, Palette } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Link href="/dashboard/products">
          <Button className="mt-4">Volver a productos</Button>
        </Link>
      </div>
    );
  }

  const stockStatus = product.stockQuantity === 0
    ? { label: 'Sin stock', variant: 'destructive' as const }
    : product.stockQuantity <= (product.lowStockThreshold || 5)
    ? { label: 'Stock bajo', variant: 'warning' as const }
    : { label: 'En stock', variant: 'default' as const };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <Link href={`/dashboard/products/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar Producto
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={imageUrl}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.shortDescription && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Descripción Corta
                  </h4>
                  <p className="text-sm">{product.shortDescription}</p>
                </div>
              )}
              {product.description && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Descripción Completa
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
              {!product.shortDescription && !product.description && (
                <p className="text-sm text-muted-foreground">Sin descripción</p>
              )}
            </CardContent>
          </Card>

          {/* Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {product.dimensions && (
                  <div className="flex items-start gap-3">
                    <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Dimensiones</p>
                      <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                    </div>
                  </div>
                )}
                {product.material && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Material</p>
                      <p className="text-sm text-muted-foreground">{product.material}</p>
                    </div>
                  </div>
                )}
                {product.finish && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Acabado</p>
                      <p className="text-sm text-muted-foreground">{product.finish}</p>
                    </div>
                  </div>
                )}
                {product.color && (
                  <div className="flex items-start gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Color</p>
                      <p className="text-sm text-muted-foreground">{product.color}</p>
                    </div>
                  </div>
                )}
              </div>
              {!product.dimensions && !product.material && !product.finish && !product.color && (
                <p className="text-sm text-muted-foreground">Sin características especificadas</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Precio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Precio de venta</p>
                <p className="text-2xl font-bold">
                  ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div>
                  <p className="text-sm text-muted-foreground">Precio anterior</p>
                  <p className="text-lg line-through text-muted-foreground">
                    ${product.comparePrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          {product.categoryName && (
            <Card>
              <CardHeader>
                <CardTitle>Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{product.categoryName}</Badge>
              </CardContent>
            </Card>
          )}

          {/* Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Stock actual</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{product.stockQuantity}</p>
                  <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock mínimo</p>
                <p className="text-lg font-medium">{product.lowStockThreshold || 5}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Slug</p>
                <p className="font-mono text-xs break-all">{product.slug}</p>
              </div>
              {product.createdAt && (
                <div>
                  <p className="text-muted-foreground">Creado</p>
                  <p>{new Date(product.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              )}
              {product.updatedAt && (
                <div>
                  <p className="text-muted-foreground">Última actualización</p>
                  <p>{new Date(product.updatedAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
