'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: productData, isLoading: isLoadingProduct } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const { data: categories } = useCategories();

  const [images, setImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    categoryId: '',
    dimensions: '',
    material: '',
    finish: '',
    color: '',
    stockQuantity: '0',
    lowStockThreshold: '5',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    if (productData) {
      setFormData({
        sku: productData.sku || '',
        name: productData.name || '',
        slug: productData.slug || '',
        description: productData.description || '',
        shortDescription: productData.shortDescription || '',
        price: productData.price?.toString() || '',
        comparePrice: productData.comparePrice?.toString() || '',
        categoryId: productData.categoryId || '',
        dimensions: productData.dimensions || '',
        material: productData.material || '',
        finish: productData.finish || '',
        color: productData.color || '',
        stockQuantity: productData.stockQuantity?.toString() || '0',
        lowStockThreshold: productData.lowStockThreshold?.toString() || '5',
        isActive: productData.isActive ?? true,
        isFeatured: productData.isFeatured ?? false,
      });

      // Cargar imágenes existentes
      if (productData.images && Array.isArray(productData.images)) {
        const existingImages: ProductImage[] = productData.images.map((url: string, index: number) => ({
          id: index,
          url,
          cloudinaryId: '',
        }));
        setImages(existingImages);
      }
    }
  }, [productData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Preparar datos incluyendo imágenes
      const imageUrls = images.map(img => img.url);

      // Determinar el categoryId a enviar
      const categoryIdToSend = formData.categoryId && formData.categoryId.trim() !== ''
        ? formData.categoryId
        : null; // Usar null en lugar de undefined para que se envíe al backend

      console.log('📤 Enviando actualización de producto:', {
        id,
        categoryId: categoryIdToSend,
        formDataCategoryId: formData.categoryId,
      });

      await updateProduct.mutateAsync({
        id,
        data: {
          ...formData,
          // Usar null para quitar categoría, o el UUID para asignarla
          categoryId: categoryIdToSend,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
          lowStockThreshold: parseInt(formData.lowStockThreshold),
          images: imageUrls.length > 0 ? imageUrls : undefined,
        },
      });

      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);

      // Extraer mensaje de error del backend
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Error desconocido al actualizar el producto';

      alert(`Error: ${errorMessage}`);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Link href="/dashboard/products">
          <Button className="mt-4">Volver a productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground">Modifica la información del producto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Información Básica */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="CER-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({
                          ...formData,
                          name,
                          slug: generateSlug(name),
                        });
                      }}
                      placeholder="Cerámico Mármol Blanco"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ceramico-marmol-blanco"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descripción Corta</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDescription: e.target.value })
                    }
                    placeholder="Cerámico de alta calidad..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Completa</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción detallada del producto..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Características */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensiones</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="60x60 cm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="Cerámica"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finish">Acabado</Label>
                    <Input
                      id="finish"
                      value={formData.finish}
                      onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                      placeholder="Brillante"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="Blanco"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes del Producto */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <CloudinaryImageUploader
                  value={images}
                  onChange={setImages}
                  productId={parseInt(id)}
                  maxImages={8}
                  disabled={updateProduct.isPending}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Sube hasta 8 imágenes del producto. La primera imagen será la principal.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Precio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Precio Comparación</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    placeholder="3000.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Precio anterior para mostrar descuento
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoría</Label>
                  <select
                    id="categoryId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Sin categoría</option>
                    {categories?.map((cat) => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option value={cat.id} className="font-medium">
                          {cat.name}
                        </option>
                        {cat.children?.map((child) => (
                          <option key={child.id} value={child.id}>
                            &nbsp;&nbsp;↳ {child.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Stock Mínimo</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, lowStockThreshold: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Producto Activo</Label>
                    <p className="text-xs text-muted-foreground">
                      El producto será visible en la tienda
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isFeatured">Producto Destacado</Label>
                    <p className="text-xs text-muted-foreground">
                      Aparecerá en la sección destacada
                    </p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={updateProduct.isPending}>
            {updateProduct.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Link href="/dashboard/products">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
