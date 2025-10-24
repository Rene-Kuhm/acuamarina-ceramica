const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function linkRealImage() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 VINCULANDO IMAGEN REAL A TECNODESPEGUE\n');
    console.log('═══════════════════════════════════════════════════════\n');

    const productId = 15; // Tecnodespegue
    const realImageUrl = 'https://res.cloudinary.com/ddztbf1se/image/upload/v1761264545/aguamarina/products/mkvn4srydaaojkmrtg24.png';

    // Primero, eliminar las imágenes de prueba
    console.log('🧹 Limpiando imágenes de prueba...');
    const deleteResult = await pool.query(
      'DELETE FROM product_images WHERE product_id = $1',
      [productId]
    );
    console.log(`   ✅ Eliminadas ${deleteResult.rowCount} imagen(es) de prueba\n`);

    // Insertar la imagen real
    console.log('📸 Insertando imagen real...');
    console.log(`   URL: ${realImageUrl}`);

    const insertResult = await pool.query(
      `INSERT INTO product_images (
        product_id, url, alt_text, is_primary, display_order
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        productId,
        realImageUrl,
        'Tecnodespegue',
        true, // Es la imagen principal
        1,    // Primera posición
      ]
    );

    console.log(`   ✅ Imagen insertada con ID: ${insertResult.rows[0].id}\n`);

    // Verificar resultado
    console.log('🔍 VERIFICACIÓN FINAL:\n');
    const verifyResult = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.sku,
        pi.id as image_id,
        pi.url,
        pi.is_primary,
        pi.display_order
       FROM products p
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.id = $1`,
      [productId]
    );

    if (verifyResult.rows.length > 0) {
      const product = verifyResult.rows[0];
      console.log(`✅ Producto: ${product.name} (ID: ${product.id})`);
      console.log(`   SKU: ${product.sku}`);

      if (product.image_id) {
        console.log(`\n📸 Imagen vinculada:`);
        console.log(`   - ID: ${product.image_id}`);
        console.log(`   - URL: ${product.url}`);
        console.log(`   - is_primary: ${product.is_primary}`);
        console.log(`   - display_order: ${product.display_order}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🎉 La imagen ahora debería aparecer en:');
    console.log('   - Frontend: https://acuamarina-ceramica.vercel.app');
    console.log('   - Dashboard: https://acuamarina-admin.vercel.app/dashboard/products');
    console.log('\n💡 Puede que necesites refrescar la página (Ctrl+F5) para ver los cambios.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

linkRealImage();
