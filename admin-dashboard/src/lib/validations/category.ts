import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
  parentId: z.string().nullable().optional(),
  displayOrder: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
