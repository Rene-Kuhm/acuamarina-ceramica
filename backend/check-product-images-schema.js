const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function checkSchema() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Verificando esquema de product_images...\n');

    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'product_images'
      ORDER BY ordinal_position
    `);

    console.log('Columnas de product_images:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Ver un registro de ejemplo
    const sampleResult = await pool.query('SELECT * FROM product_images LIMIT 1');
    if (sampleResult.rows.length > 0) {
      console.log('\nEjemplo de registro:');
      console.log(JSON.stringify(sampleResult.rows[0], null, 2));
    } else {
      console.log('\nNo hay registros en product_images');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
