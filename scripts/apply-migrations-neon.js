#!/usr/bin/env node

/**
 * Script para aplicar migraciones a Neon
 * Ejecuta: node apply-migrations-neon.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Leer el connection string de la variable de entorno o usar el de Railway
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:REPLACE_WITH_YOUR_PASSWORD@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function applyMigrations() {
  console.log('\n🚀 Aplicando migraciones a Neon...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    console.log('📡 Conectando a la base de datos...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa\n');

    // Leer el archivo de migraciones
    const migrationsPath = path.join(__dirname, '..', 'backend', 'migrations.sql');
    console.log(`📄 Leyendo migraciones desde: ${migrationsPath}`);
    
    const migrationsSQL = fs.readFileSync(migrationsPath, 'utf-8');
    console.log('✅ Archivo de migraciones leído\n');

    // Ejecutar las migraciones
    console.log('⚙️  Ejecutando migraciones...');
    await pool.query(migrationsSQL);
    console.log('✅ Migraciones aplicadas exitosamente\n');

    // Verificar que las columnas existen ahora
    console.log('🔍 Verificando estructura de tabla categories...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Columnas en tabla categories:');
    console.table(result.rows);

    // Verificar que parent_id existe
    const hasParentId = result.rows.some(row => row.column_name === 'parent_id');
    if (hasParentId) {
      console.log('\n✅ La columna parent_id existe - ¡El problema está solucionado!');
    } else {
      console.log('\n⚠️  ADVERTENCIA: La columna parent_id NO existe. Las migraciones podrían no haberse aplicado correctamente.');
    }

    console.log('\n✨ Proceso completado exitosamente\n');

  } catch (error) {
    console.error('\n❌ Error al aplicar migraciones:');
    console.error(error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Tip: Verifica que el DATABASE_URL tenga la contraseña correcta');
    } else if (error.message.includes('connect')) {
      console.error('\n💡 Tip: Verifica que el DATABASE_URL sea correcto y que tengas conexión a internet');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar
applyMigrations();
