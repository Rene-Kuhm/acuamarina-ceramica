const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function checkProductResponse() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Simulando respuesta del backend para productos...\n');

    // Simular lo que hace ProductsController.getById
    const productId = 9;

    const result = await pool.query(
      `SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [productId]
    );

    if (result.rows.length === 0) {
      console.log('❌ Producto no encontrado');
      return;
    }

    console.log('📦 Producto (datos de la tabla):');
    const product = result.rows[0];
    console.log('  - id:', product.id);
    console.log('  - name:', product.name);
    console.log('  - stock:', product.stock);
    console.log('  - stock_quantity:', product.stock_quantity);
    console.log('  - image_url:', product.image_url);
    console.log('  - images (jsonb):', product.images);

    // Get product images from product_images table
    const imagesResult = await pool.query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order, created_at`,
      [productId]
    );

    console.log('\n🖼️  Imágenes de product_images table:');
    if (imagesResult.rows.length === 0) {
      console.log('  ⚠️  Sin imágenes');
    } else {
      imagesResult.rows.forEach((img, i) => {
        console.log(`  ${i + 1}. image_url: ${img.image_url}`);
        console.log(`     is_primary: ${img.is_primary}`);
      });
    }

    // Simular la transformación que hace el ProductsController
    const productResponse = {
      ...product,
      stock: product.stock_quantity || 0, // Map stock_quantity to stock for frontend
      images: imagesResult.rows.map(img => img.image_url), // Transform to array of URLs
    };

    console.log('\n📤 Respuesta transformada que envía el backend:');
    console.log(JSON.stringify({
      success: true,
      data: productResponse
    }, null, 2));

    console.log('\n✅ Campo stock:', productResponse.stock);
    console.log('✅ Tipo de images:', Array.isArray(productResponse.images) ? 'Array' : typeof productResponse.images);
    console.log('✅ Número de imágenes:', productResponse.images.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkProductResponse();
