const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function fixCategoriesIdSequence() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔧 Arreglando la secuencia de ID en tabla categories...\n');

    // Paso 1: Crear la secuencia
    console.log('📝 Paso 1: Creando secuencia categories_id_seq...');
    await pool.query(`
      CREATE SEQUENCE IF NOT EXISTS categories_id_seq;
    `);
    console.log('✅ Secuencia creada\n');

    // Paso 2: Obtener el máximo ID actual
    const maxIdResult = await pool.query(`
      SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM categories;
    `);
    const nextId = maxIdResult.rows[0].next_id;
    console.log(`📝 Paso 2: Próximo ID será: ${nextId}`);

    // Paso 3: Ajustar la secuencia al próximo ID disponible
    await pool.query(`
      SELECT setval('categories_id_seq', $1, false);
    `, [nextId]);
    console.log('✅ Secuencia ajustada\n');

    // Paso 4: Asignar la secuencia como DEFAULT a la columna id
    console.log('📝 Paso 3: Asignando secuencia como DEFAULT...');
    await pool.query(`
      ALTER TABLE categories 
      ALTER COLUMN id SET DEFAULT nextval('categories_id_seq');
    `);
    console.log('✅ DEFAULT asignado\n');

    // Paso 5: Asignar la secuencia a la tabla (para que SERIAL funcione)
    await pool.query(`
      ALTER SEQUENCE categories_id_seq OWNED BY categories.id;
    `);
    console.log('✅ Secuencia vinculada a la columna\n');

    // Verificar
    console.log('🔍 Verificando estructura...');
    const verification = await pool.query(`
      SELECT 
        column_name, 
        column_default
      FROM information_schema.columns
      WHERE table_name = 'categories' AND column_name = 'id';
    `);

    console.log('📋 Columna ID:');
    console.table(verification.rows);

    console.log('\n✅ ¡ARREGLADO! Ahora la tabla categories puede generar IDs automáticamente');
    console.log('🎉 El error 500 debería estar SOLUCIONADO');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixCategoriesIdSequence();
