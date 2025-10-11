// Script simple para crear la base de datos
const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Conectar a la base de datos por defecto 'postgres'
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    database: 'postgres', // Conectar a la DB por defecto
  });

  try {
    await client.connect();
    console.log('✓ Conectado a PostgreSQL');

    // Verificar si la base de datos ya existe
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME || 'acuamarina_ceramicos']
    );

    if (result.rows.length > 0) {
      console.log(`✓ La base de datos '${process.env.DB_NAME}' ya existe`);
    } else {
      // Crear la base de datos
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'acuamarina_ceramicos'}`);
      console.log(`✓ Base de datos '${process.env.DB_NAME}' creada exitosamente`);
    }

    await client.end();
    console.log('\n¡Listo! Ahora puedes ejecutar: npm run db:migrate');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createDatabase();
