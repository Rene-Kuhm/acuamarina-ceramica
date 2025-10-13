export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;

  // Precios
  price: number;
  comparePrice?: number;
  costPrice?: number;

  // Características
  dimensions?: string;
  weight?: number;
  material?: string;
  finish?: string;
  color?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;

  // Control
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  lowStockThreshold: number;

  // Métricas
  viewsCount: number;
  salesCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  sku: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  dimensions?: string;
  weight?: number;
  material?: string;
  finish?: string;
  color?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
}

export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  dimensions?: string;
  weight?: number;
  material?: string;
  finish?: string;
  color?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
}
