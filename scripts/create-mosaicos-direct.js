const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function createMosaicosCategory() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🎨 Creando categoría "Mosaicos" directamente en Neon...\n');

    // Verificar si ya existe
    const existing = await pool.query(
      'SELECT * FROM categories WHERE slug = $1',
      ['mosaicos']
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  La categoría "Mosaicos" ya existe:');
      console.table(existing.rows);
      return;
    }

    // Crear categoría
    const result = await pool.query(
      `INSERT INTO categories (
        name, slug, description, parent_id, image, display_order,
        is_active, meta_title, meta_description, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *`,
      [
        'Mosaicos',
        'mosaicos',
        'Mosaicos decorativos para pisos y paredes',
        null, // parent_id (es categoría padre)
        null, // image
        1, // display_order
        true, // is_active
        'Mosaicos - Aguamarina Mosaicos',
        'Descubre nuestra colección de mosaicos decorativos para pisos y paredes'
      ]
    );

    console.log('✅ ¡Categoría "Mosaicos" creada exitosamente!\n');
    console.log('📝 Detalles:');
    console.table(result.rows);

    console.log('\n🎉 La categoría ya está disponible en la base de datos');
    console.log('💡 Railway debería reconocerla cuando termine de redesplegar');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === '23505') {
      console.log('💡 La categoría ya existe (slug duplicado)');
    }
  } finally {
    await pool.end();
  }
}

createMosaicosCategory();
