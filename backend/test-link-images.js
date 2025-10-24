const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function testLinkImages() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🧪 SIMULACIÓN: Vincular imágenes al producto Tecnodespegue\n');

    const productId = 15; // ID de Tecnodespegue
    const mockImages = [
      {
        url: 'https://res.cloudinary.com/demo/test1.jpg',
        cloudinaryId: 'aguamarina/products/test1', // Este campo se ignora porque la tabla no lo tiene
        altText: 'Imagen de prueba 1',
        isPrimary: true,
      },
      {
        url: 'https://res.cloudinary.com/demo/test2.jpg',
        cloudinaryId: 'aguamarina/products/test2',
        altText: 'Imagen de prueba 2',
        isPrimary: false,
      },
    ];

    console.log(`📦 Producto ID: ${productId}`);
    console.log(`🖼️  Imágenes a vincular: ${mockImages.length}\n`);

    // Simular el INSERT que hace linkImagesToProduct
    for (let i = 0; i < mockImages.length; i++) {
      const image = mockImages[i];

      console.log(`Procesando imagen ${i + 1}...`);
      console.log(`   - URL: ${image.url}`);
      console.log(`   - cloudinaryId: ${image.cloudinaryId} (⚠️  NO se guardará, columna no existe)`);
      console.log(`   - altText: ${image.altText}`);
      console.log(`   - isPrimary: ${image.isPrimary}`);

      try {
        const imageResult = await pool.query(
          `INSERT INTO product_images (
            product_id, url, alt_text, is_primary, display_order
          ) VALUES ($1, $2, $3, $4, $5)
          RETURNING *`,
          [
            productId,
            image.url,
            image.altText || '',
            image.isPrimary || false,
            i + 1,
          ]
        );

        console.log(`   ✅ Insertado con ID: ${imageResult.rows[0].id}\n`);

        // Si es primary, desmarcar otras
        if (image.isPrimary) {
          await pool.query(
            'UPDATE product_images SET is_primary = false WHERE product_id = $1 AND id != $2',
            [productId, imageResult.rows[0].id]
          );
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    // Verificar que se guardaron
    const verifyResult = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order',
      [productId]
    );

    console.log('═══════════════════════════════════════════');
    console.log('✅ VERIFICACIÓN FINAL:');
    console.log(`   Imágenes guardadas: ${verifyResult.rows.length}`);
    verifyResult.rows.forEach((img, i) => {
      console.log(`\n   ${i + 1}. ID: ${img.id}`);
      console.log(`      - url: ${img.url}`);
      console.log(`      - is_primary: ${img.is_primary}`);
      console.log(`      - display_order: ${img.display_order}`);
    });
    console.log('\n═══════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

testLinkImages();
