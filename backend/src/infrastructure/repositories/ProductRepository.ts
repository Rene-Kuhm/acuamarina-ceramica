import { Pool } from 'pg';
import { IProductRepository, ProductFilters } from '../../domain/repositories/IProductRepository';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../domain/entities/Product';
import { getPool } from '../database/connection';
import { NotFoundError } from '../../shared/errors/AppError';

export class ProductRepository implements IProductRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const result = await this.pool.query(
      `INSERT INTO products (
        sku, name, slug, description, short_description, category_id,
        price, compare_price, cost_price, dimensions, weight, material,
        finish, color, meta_title, meta_description, keywords,
        stock_quantity, low_stock_threshold
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        data.sku,
        data.name,
        data.slug,
        data.description || null,
        data.shortDescription || null,
        data.categoryId || null,
        data.price,
        data.comparePrice || null,
        data.costPrice || null,
        data.dimensions || null,
        data.weight || null,
        data.material || null,
        data.finish || null,
        data.color || null,
        data.metaTitle || null,
        data.metaDescription || null,
        data.keywords || null,
        data.stockQuantity || 0,
        data.lowStockThreshold || 5,
      ]
    );

    return this.mapToProduct(result.rows[0]);
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapToProduct(result.rows[0]) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const result = await this.pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    return result.rows.length > 0 ? this.mapToProduct(result.rows[0]) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const result = await this.pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
    return result.rows.length > 0 ? this.mapToProduct(result.rows[0]) : null;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.categoryId) {
      query += ` AND category_id = $${paramCount}`;
      params.push(filters.categoryId);
      paramCount++;
    }

    if (filters?.isActive !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(filters.isActive);
      paramCount++;
    }

    if (filters?.isFeatured !== undefined) {
      query += ` AND is_featured = $${paramCount}`;
      params.push(filters.isFeatured);
      paramCount++;
    }

    if (filters?.minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    if (filters?.inStock) {
      query += ` AND stock_quantity > 0`;
    }

    // Ordenamiento
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Paginación
    if (filters?.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
      paramCount++;
    }

    const result = await this.pool.query(query, params);
    return result.rows.map((row) => this.mapToProduct(row));
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        const snakeKey = this.camelToSnake(key);
        setClauses.push(`${snakeKey} = $${paramCount}`);
        params.push(value);
        paramCount++;
      }
    });

    if (setClauses.length === 0) {
      const product = await this.findById(id);
      if (!product) throw new NotFoundError('Producto no encontrado');
      return product;
    }

    params.push(id);

    const result = await this.pool.query(
      `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Producto no encontrado');
    }

    return this.mapToProduct(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const result = await this.pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Producto no encontrado');
    }
  }

  async incrementViews(id: string): Promise<void> {
    await this.pool.query('UPDATE products SET views_count = views_count + 1 WHERE id = $1', [id]);
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await this.pool.query('UPDATE products SET stock_quantity = $1 WHERE id = $2', [quantity, id]);
  }

  async count(filters?: ProductFilters): Promise<number> {
    let query = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.categoryId) {
      query += ` AND category_id = $${paramCount}`;
      params.push(filters.categoryId);
      paramCount++;
    }

    if (filters?.isActive !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(filters.isActive);
      paramCount++;
    }

    const result = await this.pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async search(queryText: string, limit: number = 20): Promise<Product[]> {
    const result = await this.pool.query(
      `SELECT * FROM products
       WHERE (name ILIKE $1 OR description ILIKE $1 OR sku ILIKE $1)
       AND is_active = true
       ORDER BY
         CASE
           WHEN name ILIKE $1 THEN 1
           WHEN sku ILIKE $1 THEN 2
           ELSE 3
         END
       LIMIT $2`,
      [`%${queryText}%`, limit]
    );

    return result.rows.map((row) => this.mapToProduct(row));
  }

  private mapToProduct(row: any): Product {
    return {
      id: row.id,
      sku: row.sku,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      categoryId: row.category_id,
      price: parseFloat(row.price),
      comparePrice: row.compare_price ? parseFloat(row.compare_price) : undefined,
      costPrice: row.cost_price ? parseFloat(row.cost_price) : undefined,
      dimensions: row.dimensions,
      weight: row.weight ? parseFloat(row.weight) : undefined,
      material: row.material,
      finish: row.finish,
      color: row.color,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      keywords: row.keywords,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      stockQuantity: row.stock_quantity,
      lowStockThreshold: row.low_stock_threshold,
      viewsCount: row.views_count,
      salesCount: row.sales_count,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
