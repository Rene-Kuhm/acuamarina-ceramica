const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function verifyCompleteFlow() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  VERIFICACIÓN COMPLETA DEL FLUJO DE IMÁGENES          ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    // 1. Verificar productos activos
    console.log('📦 1. VERIFICANDO PRODUCTOS ACTIVOS:\n');
    const productsResult = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.sku,
        p.is_active,
        p.is_featured,
        p.stock_quantity,
        COUNT(pi.id) as image_count
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    if (productsResult.rows.length === 0) {
      console.log('   ⚠️  No hay productos activos\n');
    } else {
      console.log(`   ✅ ${productsResult.rows.length} producto(s) activo(s):\n`);
      productsResult.rows.forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.name} (ID: ${product.id})`);
        console.log(`      - SKU: ${product.sku}`);
        console.log(`      - Stock: ${product.stock_quantity}`);
        console.log(`      - Imágenes: ${product.image_count}`);
        console.log(`      - Destacado: ${product.is_featured ? 'Sí' : 'No'}`);
        console.log('');
      });
    }

    // 2. Verificar imágenes en la base de datos
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📸 2. VERIFICANDO IMÁGENES EN BASE DE DATOS:\n');
    const imagesResult = await pool.query(`
      SELECT
        pi.id,
        pi.product_id,
        p.name as product_name,
        pi.url,
        pi.is_primary,
        pi.display_order
      FROM product_images pi
      JOIN products p ON p.id = pi.product_id
      ORDER BY pi.product_id, pi.display_order
    `);

    if (imagesResult.rows.length === 0) {
      console.log('   ⚠️  No hay imágenes en la base de datos\n');
    } else {
      console.log(`   ✅ ${imagesResult.rows.length} imagen(es) encontrada(s):\n`);

      let currentProductId = null;
      imagesResult.rows.forEach((img, i) => {
        if (img.product_id !== currentProductId) {
          currentProductId = img.product_id;
          console.log(`   📦 Producto: ${img.product_name} (ID: ${img.product_id})`);
        }
        console.log(`      ${i + 1}. Imagen ID: ${img.id}`);
        console.log(`         - URL: ${img.url.substring(0, 60)}...`);
        console.log(`         - Principal: ${img.is_primary ? 'Sí' : 'No'}`);
        console.log(`         - Orden: ${img.display_order}`);
        console.log('');
      });
    }

    // 3. Verificar productos sin imágenes
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('⚠️  3. VERIFICANDO PRODUCTOS SIN IMÁGENES:\n');
    const productsWithoutImages = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.sku,
        p.is_active
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE pi.id IS NULL
      ORDER BY p.created_at DESC
    `);

    if (productsWithoutImages.rows.length === 0) {
      console.log('   ✅ Todos los productos tienen imágenes\n');
    } else {
      console.log(`   ⚠️  ${productsWithoutImages.rows.length} producto(s) sin imágenes:\n`);
      productsWithoutImages.rows.forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.name} (ID: ${product.id})`);
        console.log(`      - SKU: ${product.sku}`);
        console.log(`      - Activo: ${product.is_active ? 'Sí' : 'No'}`);
        console.log('');
      });
    }

    // 4. Verificar imágenes de Cloudinary vs demo
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('☁️  4. VERIFICANDO ORIGEN DE IMÁGENES:\n');
    const imagesBySource = await pool.query(`
      SELECT
        CASE
          WHEN url LIKE '%res.cloudinary.com/ddztbf1se%' THEN 'Cloudinary Real'
          WHEN url LIKE '%res.cloudinary.com/demo%' THEN 'Demo/Prueba'
          ELSE 'Otro'
        END as source,
        COUNT(*) as count
      FROM product_images
      GROUP BY source
    `);

    if (imagesBySource.rows.length === 0) {
      console.log('   ℹ️  No hay imágenes para analizar\n');
    } else {
      imagesBySource.rows.forEach(row => {
        const icon = row.source === 'Cloudinary Real' ? '✅' :
                     row.source === 'Demo/Prueba' ? '⚠️ ' : 'ℹ️ ';
        console.log(`   ${icon} ${row.source}: ${row.count} imagen(es)`);
      });
      console.log('');
    }

    // 5. Resumen final
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📊 RESUMEN:\n');

    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM products WHERE is_active = true) as active_products,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM product_images) as total_images,
        (SELECT COUNT(DISTINCT product_id) FROM product_images) as products_with_images
    `);

    const { active_products, total_products, total_images, products_with_images } = stats.rows[0];

    console.log(`   📦 Productos totales: ${total_products}`);
    console.log(`   ✅ Productos activos: ${active_products}`);
    console.log(`   📸 Imágenes totales: ${total_images}`);
    console.log(`   🖼️  Productos con imágenes: ${products_with_images}`);

    if (active_products > 0) {
      const coverage = ((products_with_images / active_products) * 100).toFixed(1);
      console.log(`   📊 Cobertura de imágenes: ${coverage}%`);
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  ✅ VERIFICACIÓN COMPLETADA                           ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Error durante la verificación:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

verifyCompleteFlow();
