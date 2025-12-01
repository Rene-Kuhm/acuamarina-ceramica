const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function createSubcategory() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\nCreando subcategoria Mosaicos Venecianos...\n');

    const result = await pool.query(`
      INSERT INTO categories (
        name, slug, description, parent_id, image, display_order,
        is_active, meta_title, meta_description, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      'Mosaicos Venecianos',
      'mosaicos-venecianos',
      'Mosaicos venecianos de alta calidad',
      1, // parent_id de "Mosaicos"
      null,
      1,
      true,
      'Mosaicos Venecianos - Aguamarina Mosaicos',
      'Mosaicos venecianos de alta calidad para decoracion'
    ]);

    console.log('Subcategoria creada exitosamente:\n');
    console.table(result.rows);

    // Verificar la jerarquía
    console.log('\nVerificando jerarquia de categorias:\n');
    const hierarchy = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.parent_id,
        pc.name as parent_name
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      ORDER BY c.parent_id NULLS FIRST, c.id;
    `);

    console.table(hierarchy.rows);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createSubcategory();
