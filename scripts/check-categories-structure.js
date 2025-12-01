const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function checkStructure() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Estructura de tabla categories:\n');
    console.table(result.rows);

    // Verificar secuencia
    const seq = await pool.query(`
      SELECT pg_get_serial_sequence('categories', 'id') as sequence_name;
    `);
    
    console.log('\n🔢 Secuencia para id:', seq.rows[0].sequence_name);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStructure();
