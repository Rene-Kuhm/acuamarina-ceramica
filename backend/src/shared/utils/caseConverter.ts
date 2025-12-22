/**
 * Converts snake_case keys to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts object keys from snake_case to camelCase recursively
 */
export function keysToCamel<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamel(v)) as T;
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = keysToCamel(obj[key]);
      return result;
    }, {} as any) as T;
  }
  return obj;
}

/**
 * Transform product data from database format to API format
 */
export function transformProductToAPI(product: any, images: string[] = []): any {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.short_description,
    categoryId: product.category_id,
    categoryName: product.category_name,
    categorySlug: product.category_slug,
    price: parseFloat(product.price),
    comparePrice: product.compare_price ? parseFloat(product.compare_price) : null,
    costPrice: product.cost_price ? parseFloat(product.cost_price) : null,
    dimensions: product.dimensions,
    weight: product.weight,
    material: product.material,
    finish: product.finish,
    color: product.color,
    metaTitle: product.meta_title,
    metaDescription: product.meta_description,
    keywords: product.keywords,
    isActive: product.is_active,
    isFeatured: product.is_featured,
    stockQuantity: product.stock_quantity || 0,
    lowStockThreshold: product.low_stock_threshold,
    viewsCount: product.views_count || 0,
    salesCount: product.sales_count || 0,
    images,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
}

/**
 * Transform category data from database format to API format
 */
export function transformCategoryToAPI(category: any): any {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.image || category.image_url,
    parentId: category.parent_id,
    parentName: category.parent_name,
    displayOrder: category.display_order,
    isActive: category.is_active,
    productCount: parseInt(category.products_count || '0'),
    metaTitle: category.meta_title,
    metaDescription: category.meta_description,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
}
