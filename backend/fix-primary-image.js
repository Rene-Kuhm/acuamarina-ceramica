const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function fixPrimaryImage() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔧 CONFIGURANDO IMAGEN PRINCIPAL\n');

    const productId = 15; // Tecnodespegue
    const imageId = 7; // ID de la imagen real

    // Actualizar la imagen para que sea principal
    await pool.query(
      'UPDATE product_images SET is_primary = true WHERE id = $1',
      [imageId]
    );

    console.log('✅ Imagen ID 7 configurada como principal\n');

    // Verificar
    const result = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1',
      [productId]
    );

    console.log('📸 Estado final:');
    result.rows.forEach(img => {
      console.log(`   - ID: ${img.id}`);
      console.log(`     URL: ${img.url}`);
      console.log(`     is_primary: ${img.is_primary}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixPrimaryImage();
