import { z } from 'zod';

// Create Product
export const CreateProductDTOSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    description: z.string().optional(),
    sku: z.string().min(1, 'SKU es requerido'),
    price: z.number().positive('El precio debe ser positivo'),
    stock: z.number().int().nonnegative('El stock no puede ser negativo'),
    categoryId: z.string().uuid('ID de categoría inválido'),
    specifications: z.record(z.string()).optional(),
    dimensions: z
      .object({
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        depth: z.number().positive().optional(),
        unit: z.enum(['cm', 'm', 'in']).optional(),
      })
      .optional(),
    weight: z
      .object({
        value: z.number().positive().optional(),
        unit: z.enum(['kg', 'g', 'lb']).optional(),
      })
      .optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

export type CreateProductDTO = z.infer<typeof CreateProductDTOSchema>['body'];

// Update Product
export const UpdateProductDTOSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    specifications: z.record(z.string()).optional(),
    dimensions: z
      .object({
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        depth: z.number().positive().optional(),
        unit: z.enum(['cm', 'm', 'in']).optional(),
      })
      .optional(),
    weight: z
      .object({
        value: z.number().positive().optional(),
        unit: z.enum(['kg', 'g', 'lb']).optional(),
      })
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateProductDTO = z.infer<typeof UpdateProductDTOSchema>['body'];

// Get Product by ID
export const GetProductDTOSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

// List Products
export const ListProductsDTOSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    isActive: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    sortBy: z.enum(['name', 'price', 'createdAt', 'stock']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type ListProductsQuery = z.infer<typeof ListProductsDTOSchema>['query'];

// Delete Product
export const DeleteProductDTOSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});
