const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function checkSchema() {
  const client = await pool.connect();
  try {
    console.log('🔍 Verificando estructura de tabla orders...\n');

    const ordersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);

    console.log('Columnas en orders:');
    console.table(ordersColumns.rows);

    console.log('\n🔍 Verificando tabla order_items...\n');

    const itemsColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'order_items'
      ORDER BY ordinal_position;
    `);

    if (itemsColumns.rows.length === 0) {
      console.log('❌ Tabla order_items NO EXISTE');
    } else {
      console.log('Columnas en order_items:');
      console.table(itemsColumns.rows);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
