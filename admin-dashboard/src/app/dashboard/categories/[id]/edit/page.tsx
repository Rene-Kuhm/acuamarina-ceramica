'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useCategory, useUpdateCategory, useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import { generateSlug } from '@/lib/generators';
import { toast } from 'sonner';
import { uploadCategoryImage } from '@/lib/api/upload';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const { data: category, isLoading: isLoadingCategory } = useCategory(categoryId);
  const updateCategory = useUpdateCategory();
  const { data: categories } = useCategories();

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    displayOrder: '0',
    isActive: true,
  });

  // Cargar datos de la categoría cuando se obtiene
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        parentId: category.parentId || '',
        displayOrder: category.displayOrder?.toString() || '0',
        isActive: category.isActive ?? true,
      });

      if (category.imageUrl) {
        setImagePreview(category.imageUrl);
      }
    }
  }, [category]);

  // Auto-generate slug from name (solo si el slug está vacío)
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.name),
      }));
    }
  }, [formData.name, formData.slug]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      // Upload new image if selected
      let imageUrl = category?.imageUrl || '';
      if (imageFile) {
        const uploadResponse = await uploadCategoryImage(imageFile);
        imageUrl = uploadResponse.data.url;
      }

      await updateCategory.mutateAsync({
        id: categoryId,
        data: {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          parentId: formData.parentId || undefined,
          imageUrl: imageUrl || undefined,
        }
      });

      toast.success('Categoría actualizada exitosamente');

      // Redirect to categories list
      router.push('/dashboard/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al actualizar la categoría';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingCategory) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Categoría no encontrada</p>
        <Link href="/dashboard/categories">
          <Button className="mt-4">Volver a Categorías</Button>
        </Link>
      </div>
    );
  }

  // Filtrar categorías para no permitir seleccionar la misma categoría como padre
  const availableParentCategories = categories?.filter(cat => cat.id !== categoryId) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Categoría</h1>
          <p className="text-muted-foreground">Actualiza la información de la categoría</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mosaicos Decorativos"
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="mosaicos-decorativos"
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se genera automáticamente del nombre. Puedes editarlo manualmente.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen de la Categoría</Label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sube una nueva imagen (máx. 5MB) o deja la actual. Se guardará en Cloudinary.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción de la categoría..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parentId">Categoría Padre</Label>
                  <select
                    id="parentId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  >
                    <option value="">Sin categoría padre</option>
                    {availableParentCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Para crear subcategorías
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Orden de visualización</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Menor número aparece primero
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Categoría activa
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={updateCategory.isPending || isUploading}>
            {updateCategory.isPending || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? 'Subiendo imagen...' : 'Guardando...'}
              </>
            ) : (
              'Actualizar Categoría'
            )}
          </Button>
          <Link href="/dashboard/categories">
            <Button type="button" variant="outline" disabled={updateCategory.isPending || isUploading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
