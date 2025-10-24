const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function testGetAllQuery() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Probando query de getAll con transformación...\n');

    const page = 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const sortBy = 'created_at';
    const sortOrder = 'desc';

    // Get products
    const result = await pool.query(
      `SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.${sortBy} ${sortOrder}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    console.log(`✅ Productos obtenidos: ${result.rows.length}`);

    // Get images for all products
    const productIds = result.rows.map(p => p.id);
    console.log(`📦 IDs de productos: ${productIds.join(', ')}`);

    let imagesMap = {};

    if (productIds.length > 0) {
      console.log('\n🖼️  Obteniendo imágenes...');
      const imagesResult = await pool.query(
        `SELECT product_id, url FROM product_images
         WHERE product_id = ANY($1)
         ORDER BY is_primary DESC, display_order, created_at`,
        [productIds]
      );

      console.log(`✅ Imágenes obtenidas: ${imagesResult.rows.length}`);

      // Group images by product_id
      imagesResult.rows.forEach(img => {
        if (!imagesMap[img.product_id]) {
          imagesMap[img.product_id] = [];
        }
        imagesMap[img.product_id].push(img.url);
      });
    }

    // Transform products to match frontend expectations
    const transformedProducts = result.rows.map(product => ({
      ...product,
      stock: product.stock_quantity || 0,
      images: imagesMap[product.id] || [],
    }));

    console.log('\n📤 Respuesta transformada:');
    console.log(JSON.stringify({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: result.rows.length,
        totalPages: Math.ceil(result.rows.length / limit),
      }
    }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testGetAllQuery();
