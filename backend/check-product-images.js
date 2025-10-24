const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function checkProductImages() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Verificando imágenes de productos...\n');

    // Obtener el producto
    const productResult = await pool.query('SELECT id, name, image_url, images FROM products WHERE id = 9');

    if (productResult.rows.length > 0) {
      const product = productResult.rows[0];
      console.log('📦 Producto ID 9:');
      console.log(`  Nombre: ${product.name}`);
      console.log(`  image_url (columna): ${product.image_url || 'NULL'}`);
      console.log(`  images (jsonb): ${product.images ? JSON.stringify(product.images, null, 2) : 'NULL'}`);
    }

    // Verificar tabla product_images
    console.log('\n📊 Verificando tabla product_images:');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'product_images'
      ) as exists
    `);

    if (tableCheck.rows[0].exists) {
      console.log('  ✅ La tabla product_images existe');

      const imagesResult = await pool.query(`
        SELECT * FROM product_images WHERE product_id = 9
      `);

      console.log(`  Total de imágenes para producto 9: ${imagesResult.rows.length}`);

      if (imagesResult.rows.length > 0) {
        console.log('\n🖼️  Imágenes encontradas:');
        imagesResult.rows.forEach((img, index) => {
          console.log(`  ${index + 1}. ID: ${img.id}`);
          console.log(`     URL: ${img.image_url}`);
          console.log(`     Primary: ${img.is_primary}`);
          console.log(`     Display Order: ${img.display_order}`);
        });
      } else {
        console.log('  ⚠️  No hay imágenes en product_images para este producto');
      }
    } else {
      console.log('  ❌ La tabla product_images NO existe');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkProductImages();
