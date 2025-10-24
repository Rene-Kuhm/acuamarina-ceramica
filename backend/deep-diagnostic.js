const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function deepDiagnostic() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 DIAGNÓSTICO PROFUNDO DEL SISTEMA');
    console.log('═══════════════════════════════════════════════════════\n');

    // 1. Verificar productos y su estado
    console.log('📦 1. VERIFICACIÓN DE PRODUCTOS:');
    console.log('─────────────────────────────────────────────────────');
    const productsResult = await pool.query(`
      SELECT
        id,
        name,
        sku,
        is_active,
        is_featured,
        stock,
        stock_quantity,
        created_at
      FROM products
      ORDER BY created_at DESC
    `);

    console.log(`Total productos: ${productsResult.rows.length}\n`);
    productsResult.rows.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (ID: ${p.id})`);
      console.log(`   - SKU: ${p.sku}`);
      console.log(`   - is_active: ${p.is_active} ⬅️ ${p.is_active ? '✅ ACTIVO' : '❌ INACTIVO'}`);
      console.log(`   - is_featured: ${p.is_featured}`);
      console.log(`   - stock (campo obsoleto): ${p.stock}`);
      console.log(`   - stock_quantity (campo correcto): ${p.stock_quantity}`);
      console.log(`   - created_at: ${p.created_at}`);
      console.log('');
    });

    // 2. Verificar imágenes de productos
    console.log('\n🖼️  2. VERIFICACIÓN DE IMÁGENES:');
    console.log('─────────────────────────────────────────────────────');
    const imagesResult = await pool.query(`
      SELECT
        pi.id,
        pi.product_id,
        pi.url,
        pi.alt_text,
        pi.is_primary,
        pi.display_order,
        p.name as product_name
      FROM product_images pi
      LEFT JOIN products p ON pi.product_id = p.id
      ORDER BY pi.product_id, pi.display_order
    `);

    if (imagesResult.rows.length === 0) {
      console.log('⚠️  NO HAY IMÁGENES en la tabla product_images');
      console.log('   Esto explica por qué no aparecen imágenes en el frontend.\n');
    } else {
      console.log(`Total imágenes: ${imagesResult.rows.length}\n`);
      const imagesByProduct = {};
      imagesResult.rows.forEach(img => {
        if (!imagesByProduct[img.product_id]) {
          imagesByProduct[img.product_id] = [];
        }
        imagesByProduct[img.product_id].push(img);
      });

      Object.entries(imagesByProduct).forEach(([productId, images]) => {
        console.log(`Producto ID ${productId} (${images[0].product_name}):`);
        images.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.url}`);
          console.log(`     - is_primary: ${img.is_primary}`);
          console.log(`     - display_order: ${img.display_order}`);
        });
        console.log('');
      });
    }

    // 3. Simular respuesta del endpoint /products
    console.log('\n📤 3. SIMULACIÓN DE RESPUESTA DEL ENDPOINT /products:');
    console.log('─────────────────────────────────────────────────────');

    const result = await pool.query(`
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 12
    `);

    const productIds = result.rows.map(p => p.id);
    let imagesMap = {};

    if (productIds.length > 0) {
      const imagesResult = await pool.query(
        `SELECT product_id, url FROM product_images
         WHERE product_id = ANY($1)
         ORDER BY is_primary DESC, display_order, created_at`,
        [productIds]
      );

      imagesResult.rows.forEach(img => {
        if (!imagesMap[img.product_id]) {
          imagesMap[img.product_id] = [];
        }
        imagesMap[img.product_id].push(img.url);
      });
    }

    const transformedProducts = result.rows.map(product => ({
      id: product.id,
      name: product.name,
      isActive: product.is_active,
      stock: product.stock_quantity || 0,
      images: imagesMap[product.id] || [],
    }));

    console.log('Productos que se devolverían:');
    transformedProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   - isActive: ${p.isActive} ${p.isActive ? '✅' : '❌'}`);
      console.log(`   - stock: ${p.stock}`);
      console.log(`   - images: [${p.images.length} imagen(es)]`);
      if (p.images.length > 0) {
        p.images.forEach((url, j) => console.log(`     ${j + 1}. ${url}`));
      }
      console.log('');
    });

    // 4. Verificar respuesta completa
    console.log('\n📋 4. RESPUESTA COMPLETA DEL API (primeros 2 productos):');
    console.log('─────────────────────────────────────────────────────');
    console.log(JSON.stringify(transformedProducts.slice(0, 2), null, 2));

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ DIAGNÓSTICO COMPLETO');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

deepDiagnostic();
