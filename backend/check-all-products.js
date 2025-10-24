const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function checkAllProducts() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Consultando todos los productos en la base de datos...\n');

    const result = await pool.query(
      `SELECT id, name, sku, is_active, stock, stock_quantity, created_at
       FROM products
       ORDER BY created_at DESC
       LIMIT 10`
    );

    console.log(`📦 Total de productos encontrados (últimos 10): ${result.rows.length}\n`);

    result.rows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - ID: ${product.id}`);
      console.log(`   - SKU: ${product.sku}`);
      console.log(`   - is_active: ${product.is_active}`);
      console.log(`   - stock: ${product.stock}`);
      console.log(`   - stock_quantity: ${product.stock_quantity}`);
      console.log(`   - created_at: ${product.created_at}`);
      console.log('');
    });

    // Contar productos activos vs inactivos
    const statsResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true) as active,
        COUNT(*) FILTER (WHERE is_active = false) as inactive
       FROM products`
    );

    const stats = statsResult.rows[0];
    console.log('📊 Estadísticas:');
    console.log(`   - Total productos: ${stats.total}`);
    console.log(`   - Activos: ${stats.active}`);
    console.log(`   - Inactivos: ${stats.inactive}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAllProducts();
