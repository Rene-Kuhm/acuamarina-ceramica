import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Category as BaseCategory } from '@/types';
import { categoriesService, CreateCategoryDTO } from '@/services/categories.service';

// Extendemos el tipo base para incluir sub-categorías
type Category = BaseCategory & {
  children?: Category[];
};

// --- React Query Hooks ---

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await categoriesService.getAll();

      // Organizar categorías en jerarquía padre-hijo
      const parentCategories = categories.filter(cat => !cat.parentId);
      const childCategories = categories.filter(cat => cat.parentId);

      return parentCategories.map(parent => ({
        ...parent,
        children: childCategories.filter(child => child.parentId === parent.id)
      }));
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
};

interface CreateCategoryParams {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CreateCategoryParams>({
    mutationFn: async (params) => {
      // Construir DTO solo con campos definidos
      const dto: any = {
        name: params.name,
        slug: params.slug || params.name.toLowerCase().replace(/\s+/g, '-'),
        displayOrder: params.displayOrder ?? 0,
        isActive: params.isActive ?? true,
      };

      // Solo agregar campos opcionales si tienen valor
      if (params.description) dto.description = params.description;
      if (params.parentId) dto.parentId = params.parentId;
      if (params.imageUrl) dto.imageUrl = params.imageUrl;
      if (params.metaTitle) dto.metaTitle = params.metaTitle;
      if (params.metaDescription) dto.metaDescription = params.metaDescription;

      return categoriesService.create(dto);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Categoría "${data.name}" ${variables.parentId ? 'añadida' : 'creada'} correctamente.`);
    },
    onError: (error) => {
      toast.error(`Error al crear categoría: ${error.message}`);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { id: string; data: Partial<CreateCategoryParams> }>({
    mutationFn: async ({ id, data }) => {
      // Construir DTO solo con campos que tienen valor definido
      const dto: Partial<CreateCategoryDTO> = {};

      // Regex para validar UUID v4
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      if (data.name !== undefined && data.name) dto.name = data.name;
      if (data.slug !== undefined && data.slug) dto.slug = data.slug;
      if (data.description !== undefined) dto.description = data.description || undefined;

      // Solo incluir parentId si es un UUID válido o null/vacío
      if (data.parentId !== undefined) {
        if (!data.parentId || data.parentId === '') {
          dto.parentId = null;
        } else if (isUUID(data.parentId)) {
          dto.parentId = data.parentId;
        }
        // Si no es UUID válido, no incluirlo en el DTO
      }

      if (data.imageUrl !== undefined) dto.imageUrl = data.imageUrl || null;
      if (data.displayOrder !== undefined) dto.displayOrder = data.displayOrder;
      if (data.isActive !== undefined) dto.isActive = data.isActive;
      if (data.metaTitle !== undefined) dto.metaTitle = data.metaTitle || undefined;
      if (data.metaDescription !== undefined) dto.metaDescription = data.metaDescription || undefined;

      console.log('🔍 Updating category:', id);
      console.log('📦 DTO to send:', JSON.stringify(dto, null, 2));

      return categoriesService.update(id, dto);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Categoría "${data.name}" actualizada correctamente.`);
    },
    onError: (error) => {
      toast.error(`Error al actualizar categoría: ${error.message}`);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría eliminada correctamente.');
    },
    onError: (error) => {
      toast.error(`Error al eliminar categoría: ${error.message}`);
    }
  });
};
