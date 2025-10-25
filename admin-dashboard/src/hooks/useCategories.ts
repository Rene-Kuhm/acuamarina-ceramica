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
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CreateCategoryParams>({
    mutationFn: async (params) => {
      const dto: CreateCategoryDTO = {
        name: params.name,
        slug: params.slug || params.name.toLowerCase().replace(/\s+/g, '-'),
        description: params.description,
        parentId: params.parentId || null,
        imageUrl: params.imageUrl || null,
        isActive: true,
      };
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
      const dto: Partial<CreateCategoryDTO> = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        imageUrl: data.imageUrl || null,
      };
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
