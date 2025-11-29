#!/usr/bin/env node

const { Client } = require('pg');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function fixAllTableIds() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    const tables = ['audit_logs', 'refresh_tokens'];

    for (const table of tables) {
      console.log(`\n📝 Arreglando tabla: ${table}`);
      console.log('='.repeat(60));

      // Crear secuencia si no existe
      const seqName = `${table}_id_seq`;
      await client.query(`CREATE SEQUENCE IF NOT EXISTS ${seqName};`);
      console.log(`  ✓ Secuencia ${seqName} creada`);

      // Obtener el máximo ID actual
      const maxResult = await client.query(`SELECT COALESCE(MAX(id), 0) as max_id FROM ${table}`);
      const nextId = maxResult.rows[0].max_id + 1;

      // Establecer el valor de la secuencia
      await client.query(`SELECT setval('${seqName}', $1, false);`, [nextId]);
      console.log(`  ✓ Secuencia configurada (próximo ID: ${nextId})`);

      // Asignar secuencia a la columna id
      await client.query(`
        ALTER TABLE ${table}
        ALTER COLUMN id SET DEFAULT nextval('${seqName}');
      `);
      console.log(`  ✓ DEFAULT configurado en columna id`);

      // Verificar
      const verify = await client.query(`
        SELECT column_default
        FROM information_schema.columns
        WHERE table_name = $1 AND column_name = 'id'
      `, [table]);

      console.log(`  ✓ Verificado: ${verify.rows[0].column_default}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('   ✅ TODAS LAS TABLAS CORREGIDAS');
    console.log('='.repeat(60));
    console.log('\n   Las siguientes tablas ahora tienen auto-incremento:');
    tables.forEach(t => console.log(`     - ${t}`));
    console.log('\n   El sistema debería funcionar sin errores ahora\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixAllTableIds();
