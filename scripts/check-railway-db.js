const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function checkDatabase() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n📊 Verificando base de datos Neon...\n');
    
    // Verificar usuarios
    const users = await pool.query('SELECT email, role FROM users');
    console.log('👥 Usuarios en la base de datos:');
    console.table(users.rows);
    
    // Verificar categorías
    const cats = await pool.query('SELECT id, name, parent_id, is_active FROM categories');
    console.log('\n📁 Categorías en la base de datos:');
    console.table(cats.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
