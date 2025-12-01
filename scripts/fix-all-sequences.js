const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function fixAllSequences() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\nArreglando secuencias de TODAS las tablas...\n');

    const tablesToFix = [
      'contacts',
      'customers',
      'newsletter_subscribers',
      'order_items',
      'orders',
      'product_images',
      'products',
      'reviews',
      'users'
    ];

    for (const tableName of tablesToFix) {
      console.log(`\nArreglando ${tableName}...`);

      try {
        // 1. Crear secuencia
        const seqName = `${tableName}_id_seq`;
        await pool.query(`CREATE SEQUENCE IF NOT EXISTS ${seqName};`);
        console.log(`  Secuencia ${seqName} creada`);

        // 2. Obtener máximo ID
        const maxResult = await pool.query(`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM ${tableName};`);
        const nextId = maxResult.rows[0].next_id;
        console.log(`  Proximo ID: ${nextId}`);

        // 3. Ajustar secuencia
        await pool.query(`SELECT setval('${seqName}', $1, false);`, [nextId]);

        // 4. Asignar DEFAULT
        await pool.query(`ALTER TABLE ${tableName} ALTER COLUMN id SET DEFAULT nextval('${seqName}');`);

        // 5. Vincular secuencia
        await pool.query(`ALTER SEQUENCE ${seqName} OWNED BY ${tableName}.id;`);

        console.log(`  OK ${tableName}`);

      } catch (error) {
        console.log(`  ERROR en ${tableName}:`, error.message);
      }
    }

    console.log('\n\nVerificando resultado...\n');

    for (const tableName of tablesToFix) {
      const result = await pool.query(`
        SELECT column_default
        FROM information_schema.columns
        WHERE table_name = $1 AND column_name = 'id';
      `, [tableName]);

      const status = result.rows[0].column_default ? 'OK' : 'FALTA';
      console.log(`[${status}] ${tableName}`);
    }

    console.log('\nTODAS LAS SECUENCIAS ARREGLADAS');
    console.log('Ahora el sistema deberia funcionar correctamente');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixAllSequences();
