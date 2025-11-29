#!/usr/bin/env node

/**
 * Script para importar datos a Neon desde el backup de Supabase
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const BACKUP_FILE = path.join(__dirname, 'backup', 'full_backup.sql');

async function importToNeon() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado exitosamente a Neon\n');

    // Leer el archivo de backup
    console.log('📂 Leyendo archivo de backup...');
    if (!fs.existsSync(BACKUP_FILE)) {
      throw new Error(`Archivo de backup no encontrado: ${BACKUP_FILE}`);
    }

    const sqlContent = fs.readFileSync(BACKUP_FILE, 'utf8');
    console.log(`✓ Archivo leído: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

    // Dividir el SQL en statements individuales
    console.log('🔄 Ejecutando statements SQL...');
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Mostrar progreso cada 50 statements
      if (i % 50 === 0) {
        console.log(`  Progreso: ${i}/${statements.length} statements...`);
      }

      try {
        await client.query(statement + ';');
        successCount++;
      } catch (error) {
        // Ignorar errores de DROP TABLE si la tabla no existe
        if (!error.message.includes('does not exist')) {
          console.warn(`  ⚠️  Error en statement ${i}: ${error.message.substring(0, 100)}`);
          errorCount++;
        }
      }
    }

    console.log('\n📊 Resumen de importación:');
    console.log(`  ✅ Exitosos: ${successCount}`);
    if (errorCount > 0) {
      console.log(`  ⚠️  Errores: ${errorCount}`);
    }

    // Verificar las tablas importadas
    console.log('\n🔍 Verificando tablas importadas...');
    const result = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log(`✓ Encontradas ${result.rows.length} tablas:`);
    result.rows.forEach(row => {
      console.log(`  - ${row.tablename}`);
    });

    // Verificar usuarios
    console.log('\n👥 Verificando usuarios...');
    const usersResult = await client.query('SELECT id, email, name, role FROM users');
    console.log(`✓ ${usersResult.rows.length} usuarios importados:`);
    usersResult.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    console.log('\n✅ Importación completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('  1. Actualiza DATABASE_URL en Railway con:');
    console.log('     postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');
    console.log('  2. Railway redesplegará automáticamente');
    console.log('  3. Prueba el login en https://admin.aguamarinamosaicos.com');

  } catch (error) {
    console.error('\n❌ Error durante la importación:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar
importToNeon();
