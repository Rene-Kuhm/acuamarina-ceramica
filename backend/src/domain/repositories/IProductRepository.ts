import { Product, CreateProductDTO, UpdateProductDTO } from '../entities/Product';

export interface IProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  update(id: string, data: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
  updateStock(id: string, quantity: number): Promise<void>;
  count(filters?: ProductFilters): Promise<number>;
  search(query: string, limit?: number): Promise<Product[]>;
}

export interface ProductFilters {
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'name' | 'createdAt' | 'salesCount';
  sortOrder?: 'asc' | 'desc';
}
