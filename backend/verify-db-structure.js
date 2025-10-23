const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function verifyDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 Verificando estructura de la base de datos...\n');

    // 1. Verificar que la tabla categories existe
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('categories', 'products', 'users', 'orders')
      ORDER BY table_name
    `);

    console.log('📊 Tablas encontradas:');
    if (tablesResult.rows.length === 0) {
      console.log('  ❌ No se encontraron tablas importantes');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  ✅ ${row.table_name}`);
      });
    }

    // 2. Verificar estructura de la tabla categories
    console.log('\n📋 Estructura de la tabla categories:');
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position
    `);

    if (columnsResult.rows.length === 0) {
      console.log('  ❌ La tabla categories NO existe');
    } else {
      columnsResult.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    }

    // 3. Contar registros en categories
    console.log('\n📈 Datos en la tabla categories:');
    try {
      const countResult = await pool.query('SELECT COUNT(*) as count FROM categories');
      console.log(`  Total de categorías: ${countResult.rows[0].count}`);
    } catch (error) {
      console.log(`  ❌ Error al contar: ${error.message}`);
    }

    // 4. Verificar otras tablas relacionadas
    console.log('\n📊 Conteo de registros:');
    const tables = ['products', 'users', 'orders'];
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`  ${table}: ${result.rows[0].count} registros`);
      } catch (error) {
        console.log(`  ${table}: ❌ Error - ${error.message}`);
      }
    }

    console.log('\n✅ Verificación completada\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
