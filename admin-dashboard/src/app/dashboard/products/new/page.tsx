'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, RefreshCw } from 'lucide-react';
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';
import { generateSKU, generateSlug } from '@/lib/generators';
import { toast } from 'sonner';

// Replace previous formSchema with this safe/coercing schema
const formSchema = z.object({
	sku: z.string().min(1, 'El SKU es requerido'),
	name: z.string().min(1, 'El nombre es requerido'),
	slug: z.string().optional(),
	description: z.string().optional(),
	shortDescription: z.string().optional(),

	// Coerce strings to numbers safely using preprocess so Zod infers number types
	price: z.preprocess(
		(val) => {
			if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
			return val;
		},
		z.number().min(0, 'El precio no puede ser negativo')
	),

	comparePrice: z.preprocess(
		(val) => {
			if (val === '' || val === null || val === undefined) return undefined;
			if (typeof val === 'string') return Number(val);
			return val;
		},
		z.number().optional()
	),

	categoryId: z.string().optional(),

	stockQuantity: z.preprocess(
		(val) => {
			if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
			return val;
		},
		z.number().int().min(0, 'El stock debe ser un entero no negativo')
	),

	lowStockThreshold: z.preprocess(
		(val) => {
			if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
			return val;
		},
		z.number().int().min(0, 'El umbral debe ser un entero no negativo')
	),

	dimensions: z.string().optional(),
	material: z.string().optional(),
	finish: z.string().optional(),
	color: z.string().optional(),

	isActive: z.boolean().default(true),
	isFeatured: z.boolean().default(false),

	images: z.array(z.custom<ProductImage>()).optional().default([]),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const [createdProductId, setCreatedProductId] = useState<number | undefined>(undefined);

  const form = useForm<ProductFormValues>({
	// resolver causa conflictos de tipos con los genéricos de react-hook-form -> castear a any para evitar error TS
	resolver: zodResolver(formSchema) as any,
	defaultValues: {
		sku: generateSKU(), // Auto-generate SKU on load
		name: '',
		slug: '',
		price: 0,
		stockQuantity: 0,
		lowStockThreshold: 10,
		isActive: true,
		isFeatured: false,
		images: [],
	},
  });

  // Auto-generate slug from name
  const name = form.watch('name');
  useEffect(() => {
    if (name && !form.formState.dirtyFields.slug) {
      form.setValue('slug', generateSlug(name), { shouldValidate: false });
    }
  }, [name, form]);

  const handleGenerateNewSKU = () => {
    form.setValue('sku', generateSKU(), { shouldValidate: true });
    toast.success('Nuevo SKU generado');
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // 1. Preparar datos del producto (sin imágenes)
      const { images, ...productData } = data;

      const finalData = {
        ...productData,
        slug: data.slug || generateSlug(data.name),
      };

      // 2. Crear el producto primero
      const createdProduct = await createProduct.mutateAsync(finalData as any);

      // 3. Guardar el ID del producto recién creado
      const productId = parseInt(createdProduct.id);
      setCreatedProductId(productId);

      toast.success('Producto creado exitosamente.');

      // 4. Si había imágenes pre-cargadas, vincularlas al producto
      if (images && images.length > 0) {
        console.log('📸 Intentando vincular imágenes:', images);
        toast.info(`Vinculando ${images.length} imagen(es) al producto...`);

        try {
          // Usar el nuevo endpoint para vincular imágenes directamente
          const { linkImagesToProduct } = await import('@/lib/api/upload');
          const imagesToLink = images
            .filter(img => img.cloudinaryId) // Solo imágenes con cloudinaryId válido
            .map(img => ({
              url: img.url,
              cloudinaryId: img.cloudinaryId!,
              altText: img.altText,
              isPrimary: img.isPrimary,
            }));

          console.log('📸 Imágenes filtradas para vincular:', imagesToLink);

          if (imagesToLink.length > 0) {
            console.log('🔗 Llamando a linkImagesToProduct...');
            const result = await linkImagesToProduct(productId, imagesToLink);
            console.log('✅ Resultado de vinculación:', result);
            toast.success('Todas las imágenes han sido vinculadas al producto.');
          } else {
            console.warn('⚠️ No hay imágenes con cloudinaryId para vincular');
            toast.warning('Las imágenes no tienen cloudinaryId. Verifica la configuración de Cloudinary.');
          }
        } catch (error: any) {
          console.error('❌ Error linking images:', error);
          console.error('Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
          });
          const errorMsg = error?.response?.data?.message || error?.message || 'Error desconocido';
          toast.error(`Error al vincular las imágenes: ${errorMsg}`);
        }
      } else {
        console.log('ℹ️ No hay imágenes para vincular');
      }

      // Redirect to products list after success
      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error?.response?.data?.message || 'Error al crear el producto');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="PROD-20240101-1234" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleGenerateNewSKU}
                        title="Generar nuevo SKU"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      SKU generado automáticamente. Puedes cambiarlo o generar uno nuevo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Mosaico de vidrio azul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="mosaico-vidrio-azul" {...field} />
                    </FormControl>
                    <FormDescription>
                      Se genera automáticamente del nombre. Puedes editarlo manualmente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CloudinaryImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        productId={createdProductId}
                        maxImages={8}
                        disabled={createProduct.isPending}
                      />
                    </FormControl>
                    {!createdProductId && (
                      <p className="text-sm text-amber-600 dark:text-amber-500">
                        💡 Las imágenes se vincularán al producto después de crearlo
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Corta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Un breve resumen del producto..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Completa</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Describe el producto en detalle..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... otros campos como dimensions, material, finish, color ... */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precio y Categoría</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comparePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Comparación</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Precio anterior para mostrar un descuento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingCategories ? 'Cargando...' : 'Selecciona una categoría'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesData?.map((category) => (
                          <React.Fragment key={category.id}>
                            <SelectItem value={category.id}>
                              {category.name}
                            </SelectItem>
                            {category.children?.map((child) => (
                              <SelectItem key={child.id} value={child.id} className="pl-6">
                                {child.name}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad en Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Umbral de Stock Bajo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Publicado</FormLabel>
                      <FormDescription>
                        Si está activo, el producto será visible en la tienda.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Producto Destacado</FormLabel>
                      <FormDescription>
                        Los productos destacados aparecen en la página principal.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Producto
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
