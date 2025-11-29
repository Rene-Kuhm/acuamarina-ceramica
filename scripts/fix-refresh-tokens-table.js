#!/usr/bin/env node

const { Client } = require('pg');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function fixRefreshTokensTable() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    // Verificar estructura actual
    console.log('🔍 Verificando estructura de refresh_tokens...');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'refresh_tokens'
      ORDER BY ordinal_position
    `);

    console.log('Columnas actuales:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default || 'none'})`);
    });

    // Agregar DEFAULT a la columna id si no lo tiene
    console.log('\n📝 Agregando DEFAULT SERIAL a columna id...');

    // Primero, crear una secuencia si no existe
    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS refresh_tokens_id_seq;
    `);

    // Establecer el valor actual de la secuencia
    const maxId = await client.query('SELECT COALESCE(MAX(id), 0) as max_id FROM refresh_tokens');
    const nextId = maxId.rows[0].max_id + 1;

    await client.query(`
      SELECT setval('refresh_tokens_id_seq', $1, false);
    `, [nextId]);

    // Asignar la secuencia a la columna id
    await client.query(`
      ALTER TABLE refresh_tokens
      ALTER COLUMN id SET DEFAULT nextval('refresh_tokens_id_seq');
    `);

    console.log('✓ DEFAULT agregado a columna id\n');

    // Verificar cambios
    console.log('✅ Verificando cambios...');
    const updatedInfo = await client.query(`
      SELECT column_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'refresh_tokens' AND column_name = 'id'
    `);

    console.log(`   id: ${updatedInfo.rows[0].column_default}\n`);

    console.log('='.repeat(60));
    console.log('   ✅ TABLA refresh_tokens CORREGIDA');
    console.log('='.repeat(60));
    console.log('');
    console.log('   Ahora el login debería funcionar completamente');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixRefreshTokensTable();
