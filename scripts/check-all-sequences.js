const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function checkAllSequences() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\nVerificando secuencias de todas las tablas...\n');

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('Tablas encontradas:', tables.rows.length, '\n');

    const problematicTables = [];

    for (const table of tables.rows) {
      const tableName = table.table_name;

      const idColumn = await pool.query(`
        SELECT column_name, column_default
        FROM information_schema.columns
        WHERE table_name = $1 AND column_name = 'id';
      `, [tableName]);

      if (idColumn.rows.length > 0) {
        const hasDefault = idColumn.rows[0].column_default;
        const status = hasDefault ? 'OK' : 'FALTA';
        console.log(`[${status}] ${tableName} - ${hasDefault || 'NO SEQUENCE'}`);

        if (!hasDefault) {
          problematicTables.push(tableName);
        }
      }
    }

    if (problematicTables.length > 0) {
      console.log('\nTablas sin secuencia:', problematicTables.join(', '));
    } else {
      console.log('\nTodas las tablas tienen secuencias correctas');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAllSequences();
