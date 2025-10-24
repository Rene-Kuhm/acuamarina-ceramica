const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function checkProductsTable() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Verificando tabla products...\n');

    // Estructura de la tabla
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);

    console.log('📋 Columnas de la tabla products:');
    columnsResult.rows.forEach(col => {
      console.log(`  - ${col.column_name.padEnd(25)} ${col.data_type.padEnd(25)} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Contar productos
    const countResult = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log(`\n📊 Total de productos: ${countResult.rows[0].count}`);

    // Ver primeros productos si existen
    if (parseInt(countResult.rows[0].count) > 0) {
      const productsResult = await pool.query('SELECT id, name, sku, slug FROM products LIMIT 3');
      console.log('\n📦 Primeros productos:');
      productsResult.rows.forEach(p => {
        console.log(`  - ID: ${p.id} | SKU: ${p.sku} | Name: ${p.name} | Slug: ${p.slug || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkProductsTable();
