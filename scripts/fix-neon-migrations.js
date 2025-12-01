#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function fixMigrations() {
  console.log('\n🚀 Aplicando migraciones completas a Neon...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('📡 Conectando a la base de datos...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa\n');

    // Paso 1: Crear la función update_updated_at_column si no existe
    console.log('⚙️  Paso 1: Creando función update_updated_at_column...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ Función creada\n');

    // Paso 2: Ejecutar las migraciones
    console.log('⚙️  Paso 2: Ejecutando migraciones...');
    const migrationsPath = path.join(__dirname, '..', 'backend', 'migrations.sql');
    const migrationsSQL = fs.readFileSync(migrationsPath, 'utf-8');
    await pool.query(migrationsSQL);
    console.log('✅ Migraciones aplicadas\n');

    // Paso 3: Verificar estructura de categories
    console.log('🔍 Paso 3: Verificando estructura de tabla categories...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Columnas en tabla categories:');
    console.table(result.rows);

    // Verificar columnas clave
    const requiredColumns = ['parent_id', 'display_order', 'is_active', 'meta_title', 'meta_description'];
    const existingColumns = result.rows.map(row => row.column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log('\n✅ ¡ÉXITO! Todas las columnas necesarias existen');
      console.log('✅ El error 500 al crear categorías está SOLUCIONADO\n');
    } else {
      console.log('\n⚠️  ADVERTENCIA: Faltan columnas:', missingColumns.join(', '));
    }

    console.log('✨ Proceso completado\n');

  } catch (error) {
    console.error('\n❌ Error:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixMigrations();
