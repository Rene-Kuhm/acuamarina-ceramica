const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function cleanupTestImages() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🧹 LIMPIANDO IMÁGENES DE PRUEBA DE LA BASE DE DATOS\n');
    console.log('═══════════════════════════════════════════════════════\n');

    const productId = 15; // Tecnodespegue

    // Verificar imágenes actuales
    console.log('📋 Imágenes actuales en el producto Tecnodespegue:');
    const currentImages = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1',
      [productId]
    );

    if (currentImages.rows.length === 0) {
      console.log('   ✅ No hay imágenes para limpiar\n');
      return;
    }

    console.log(`   Total: ${currentImages.rows.length} imágenes\n`);
    currentImages.rows.forEach((img, i) => {
      console.log(`   ${i + 1}. ID: ${img.id}`);
      console.log(`      - URL: ${img.url}`);
      console.log(`      - is_primary: ${img.is_primary}`);
      console.log(`      - display_order: ${img.display_order}`);

      // Marcar si es imagen de prueba
      if (img.url.includes('res.cloudinary.com/demo')) {
        console.log(`      ⚠️  IMAGEN DE PRUEBA - SE ELIMINARÁ`);
      } else {
        console.log(`      ✅ IMAGEN REAL - SE MANTENDRÁ`);
      }
      console.log('');
    });

    // Eliminar solo las imágenes de prueba (las que tienen /demo/ en la URL)
    console.log('🗑️  Eliminando imágenes de prueba...');
    const deleteResult = await pool.query(
      `DELETE FROM product_images
       WHERE product_id = $1
       AND url LIKE '%res.cloudinary.com/demo%'
       RETURNING *`,
      [productId]
    );

    console.log(`   ✅ Eliminadas ${deleteResult.rowCount} imagen(es) de prueba\n`);

    if (deleteResult.rowCount > 0) {
      deleteResult.rows.forEach((img, i) => {
        console.log(`   ${i + 1}. ID: ${img.id} - ${img.url}`);
      });
      console.log('');
    }

    // Verificar resultado final
    console.log('🔍 VERIFICACIÓN FINAL:\n');
    const finalImages = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order',
      [productId]
    );

    if (finalImages.rows.length === 0) {
      console.log('   ⚠️  No quedan imágenes en el producto');
    } else {
      console.log(`   ✅ ${finalImages.rows.length} imagen(es) reales mantenida(s):\n`);
      finalImages.rows.forEach((img, i) => {
        console.log(`   ${i + 1}. ID: ${img.id}`);
        console.log(`      - URL: ${img.url}`);
        console.log(`      - is_primary: ${img.is_primary}`);
        console.log(`      - display_order: ${img.display_order}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

cleanupTestImages();
