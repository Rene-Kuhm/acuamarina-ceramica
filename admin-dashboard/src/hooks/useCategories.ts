import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Category as BaseCategory } from '@/types';

// Extendemos el tipo base para incluir sub-categorías
type Category = BaseCategory & {
  children: Category[];
};

// --- Mock API Functions (reemplazar con llamadas a tu API real) ---

// Simula una base de datos en memoria
let mockCategories: Category[] = [
  {
    id: '1',
    name: 'Mosaicos',
    slug: 'mosaicos',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: '1-1',
        name: 'Mosaicos de Vidrio',
        slug: 'mosaicos-de-vidrio',
        displayOrder: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
      },
    ],
  },
  { id: '2', name: 'Cerámicos', slug: 'ceramicos', displayOrder: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), children: [] },
];

const fetchCategories = async (): Promise<Category[]> => {
  console.log('Fetching categories...');
  await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de red
  return JSON.parse(JSON.stringify(mockCategories));
};

const createCategory = async (category: { name: string; parentId?: string }): Promise<Category> => {
  console.log('Creating category:', category);
  await new Promise(resolve => setTimeout(resolve, 500));
  const newCategory: Category = {
    id: Date.now().toString(),
    name: category.name,
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
    displayOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  if (category.parentId) {
    const parent = mockCategories.find(p => p.id === category.parentId);
    if (!parent) throw new Error('Parent category not found');
    parent.children.push(newCategory);
  } else {
    mockCategories.push(newCategory);
  }
  return newCategory;
};

const deleteCategory = async (id: string): Promise<{ id: string }> => {
    console.log('Deleting category:', id);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Intenta eliminar como categoría padre
    const initialLength = mockCategories.length;
    mockCategories = mockCategories.filter(c => c.id !== id);

    // Si no se eliminó, busca en sub-categorías
    if (mockCategories.length === initialLength) {
        mockCategories.forEach(parent => {
            parent.children = parent.children.filter((child: Category) => child.id !== id);
        });
    }

    return { id };
};


// --- React Query Hooks ---

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { name: string; parentId?: string }>({
    mutationFn: createCategory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Categoría "${data.name}" ${variables.parentId ? 'añadida' : 'creada'} correctamente.`);
    },
    onError: (error) => {
      toast.error(`Error al crear categoría: ${error.message}`);
    },
  });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation< { id: string }, Error, string>({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Categoría eliminada correctamente.');
        },
        onError: (error) => {
            toast.error(`Error al eliminar categoría: ${error.message}`);
        }
    });
};
