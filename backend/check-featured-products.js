const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function checkFeaturedProducts() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Verificando productos destacados...\n');

    // Ver todos los productos y su estado de featured
    const allResult = await pool.query(
      `SELECT id, name, is_active, is_featured, created_at
       FROM products
       ORDER BY created_at DESC`
    );

    console.log('📦 Todos los productos:');
    allResult.rows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - is_active: ${product.is_active}`);
      console.log(`   - is_featured: ${product.is_featured}`);
      console.log('');
    });

    // Ver cuántos son destacados
    const featuredResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM products
       WHERE is_active = true AND is_featured = true`
    );

    console.log(`⭐ Productos destacados activos: ${featuredResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkFeaturedProducts();
