import { z } from 'zod';

export const productFormSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido').max(50),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.number({ required_error: 'El precio es requerido' }).positive('El precio debe ser mayor a 0'),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().optional(),
  dimensions: z.string().max(100).optional(),
  material: z.string().max(100).optional(),
  finish: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  stockQuantity: z.number().int().nonnegative('El stock no puede ser negativo').default(0),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
