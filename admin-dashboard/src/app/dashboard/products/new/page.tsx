'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { productFormSchema, type ProductFormValues } from '@/lib/validations/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: '',
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 0,
      comparePrice: undefined,
      categoryId: '',
      dimensions: '',
      material: '',
      finish: '',
      color: '',
      stockQuantity: 0,
      lowStockThreshold: 5,
      isActive: true,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct.mutateAsync(data);
      toast.success('Producto creado correctamente');
      router.push('/dashboard/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear el producto');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Nuevo Producto
          </h1>
          <p className="text-muted-foreground mt-1">
            Completa la información del producto
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Información Básica */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input placeholder="CER-001" {...field} />
                          </FormControl>
                          <FormDescription>
                            Código único del producto
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
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Cerámico Mármol Blanco"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (!form.getValues('slug')) {
                                  form.setValue('slug', generateSlug(e.target.value));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="ceramico-marmol-blanco" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL amigable (se genera automáticamente)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Corta</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cerámico de alta calidad..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 500 caracteres
                        </FormDescription>
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
                          <Textarea
                            placeholder="Descripción detallada del producto..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Información detallada para el cliente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Características */}
              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Características</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dimensiones</FormLabel>
                          <FormControl>
                            <Input placeholder="60x60 cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <FormControl>
                            <Input placeholder="Cerámica" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="finish"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acabado</FormLabel>
                          <FormControl>
                            <Input placeholder="Brillante" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input placeholder="Blanco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Precio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="2500.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
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
                        <FormLabel>Precio Comparación</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="3000.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Precio anterior para mostrar descuento
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Categoría</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Sin categoría</SelectItem>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Inventario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Cantidad disponible</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Mínimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Alerta cuando el stock sea menor
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Estado</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Producto Activo</FormLabel>
                          <FormDescription>
                            Visible en la tienda
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              disabled={createProduct.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20"
            >
              {createProduct.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createProduct.isPending ? 'Guardando...' : 'Crear Producto'}
            </Button>
            <Link href="/dashboard/products">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
