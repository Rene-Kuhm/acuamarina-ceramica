// Test the transformation directly
const transformProductToAPI = (product, images = []) => {
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
};

// Simular un producto de la BD
const dbProduct = {
  id: 14,
  sku: 'PROD-20251023-3481',
  name: 'tt',
  slug: 'tt',
  description: 'test',
  short_description: 'test',
  category_id: null,
  category_name: null,
  category_slug: null,
  price: '4.00',
  compare_price: null,
  cost_price: null,
  dimensions: null,
  weight: null,
  material: null,
  finish: null,
  color: null,
  meta_title: null,
  meta_description: null,
  keywords: null,
  is_active: true,
  is_featured: false,
  stock_quantity: 4,
  low_stock_threshold: 10,
  views_count: 0,
  sales_count: 0,
  created_at: '2025-10-24T04:17:29.000Z',
  updated_at: '2025-10-24T04:17:29.000Z',
};

console.log('🔄 Producto de la BD (snake_case):');
console.log(JSON.stringify(dbProduct, null, 2));

console.log('\n📤 Producto transformado (camelCase):');
const transformed = transformProductToAPI(dbProduct, []);
console.log(JSON.stringify(transformed, null, 2));

console.log('\n✅ Verificación:');
console.log(`  - isActive: ${transformed.isActive} (debe ser true)`);
console.log(`  - isFeatured: ${transformed.isFeatured} (debe ser false)`);
console.log(`  - stockQuantity: ${transformed.stockQuantity} (debe ser 4)`);
console.log(`  - price: ${transformed.price} (debe ser 4)`);
