#!/usr/bin/env node

/**
 * Script para exportar datos de Supabase a archivos SQL
 * Usa pg (PostgreSQL client para Node.js)
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const CONNECTION_STRING = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

const OUTPUT_DIR = path.join(__dirname, 'backup');
const SCHEMA_FILE = path.join(OUTPUT_DIR, 'schema.sql');
const DATA_FILE = path.join(OUTPUT_DIR, 'data.sql');

// Crear directorio de backup si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function exportDatabase() {
  const client = new Client({
    connectionString: CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✓ Conectado exitosamente\n');

    // Obtener todas las tablas del schema public
    console.log('📋 Obteniendo lista de tablas...');
    const tablesResult = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    console.log(`✓ Encontradas ${tables.length} tablas: ${tables.join(', ')}\n`);

    let schemaSQL = '-- Schema Export from Supabase\n';
    schemaSQL += '-- Generated: ' + new Date().toISOString() + '\n\n';
    schemaSQL += 'SET client_encoding = \'UTF8\';\n';
    schemaSQL += 'SET standard_conforming_strings = on;\n\n';

    let dataSQL = '-- Data Export from Supabase\n';
    dataSQL += '-- Generated: ' + new Date().toISOString() + '\n\n';

    // Exportar schema y datos de cada tabla
    for (const table of tables) {
      console.log(`📦 Exportando tabla: ${table}`);

      // Obtener schema de la tabla
      const schemaResult = await client.query(`
        SELECT
          'CREATE TABLE ' || quote_ident(tablename) || ' (' ||
          string_agg(
            quote_ident(attname) || ' ' ||
            format_type(atttypid, atttypmod) ||
            CASE WHEN attnotnull THEN ' NOT NULL' ELSE '' END,
            ', '
          ) || ');'
        FROM pg_tables t
        JOIN pg_attribute a ON a.attrelid = (quote_ident(schemaname) || '.' || quote_ident(tablename))::regclass
        WHERE schemaname = 'public'
          AND tablename = $1
          AND attnum > 0
          AND NOT attisdropped
        GROUP BY tablename;
      `, [table]);

      if (schemaResult.rows.length > 0) {
        schemaSQL += `-- Table: ${table}\n`;
        schemaSQL += `DROP TABLE IF EXISTS ${table} CASCADE;\n`;
        schemaSQL += schemaResult.rows[0]['?column?'] + '\n\n';
      }

      // Obtener datos de la tabla
      const dataResult = await client.query(`SELECT * FROM ${table}`);

      if (dataResult.rows.length > 0) {
        console.log(`  ✓ ${dataResult.rows.length} registros`);

        dataSQL += `-- Data for table: ${table}\n`;

        // Obtener nombres de columnas
        const columns = Object.keys(dataResult.rows[0]);

        for (const row of dataResult.rows) {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            return val;
          });

          dataSQL += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
        }

        dataSQL += '\n';
      } else {
        console.log(`  ℹ️  Tabla vacía`);
      }
    }

    // Guardar archivos
    console.log('\n💾 Guardando archivos...');
    fs.writeFileSync(SCHEMA_FILE, schemaSQL);
    console.log(`✓ Schema guardado en: ${SCHEMA_FILE}`);

    fs.writeFileSync(DATA_FILE, dataSQL);
    console.log(`✓ Datos guardados en: ${DATA_FILE}`);

    // Crear archivo combinado
    const FULL_FILE = path.join(OUTPUT_DIR, 'full_backup.sql');
    fs.writeFileSync(FULL_FILE, schemaSQL + '\n' + dataSQL);
    console.log(`✓ Backup completo en: ${FULL_FILE}`);

    console.log('\n✅ Exportación completada exitosamente!');
    console.log(`📂 Archivos en: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('\n❌ Error durante la exportación:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar
exportDatabase();
