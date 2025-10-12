'use client';

import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

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

	images: z.array(z.union([z.string().url(), z.instanceof(File)])).optional().default([]),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();

  const form = useForm<ProductFormValues>({
	// resolver causa conflictos de tipos con los genéricos de react-hook-form -> castear a any para evitar error TS
	resolver: zodResolver(formSchema) as any,
	defaultValues: {
		sku: '',
		name: '',
		price: 0,
		stockQuantity: 0,
		lowStockThreshold: 10,
		isActive: true,
		images: [],
	},
  });

  const onSubmit = async (data: ProductFormValues) => {
    const finalData = {
      ...data,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
    };
    // Aquí deberías manejar la subida de archivos `File` a tu servicio de almacenamiento
    // y reemplazar los objetos `File` con las URLs resultantes antes de enviar a la API.
    console.log('Form data to submit:', finalData);
    // createProduct.mutate(finalData);
    // Por ahora, solo mostramos los datos en consola.
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
                    <FormControl>
                      <Input placeholder="SKU-001" {...field} />
                    </FormControl>
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
                      Si se deja en blanco, se generará a partir del nombre.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
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
                            {category.children.map((child) => (
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
            <CardContent>
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
