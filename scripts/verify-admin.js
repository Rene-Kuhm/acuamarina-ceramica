#!/usr/bin/env node

const { Client } = require('pg');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function verifyAdmin() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    // Buscar usuario admin
    console.log('🔍 Buscando usuario admin...');
    const result = await client.query(`
      SELECT id, email, name, role,
             LEFT(password, 20) || '...' as password_preview,
             created_at
      FROM users
      WHERE email = 'admin@aguamarina.com'
    `);

    if (result.rows.length === 0) {
      console.log('❌ Usuario admin NO EXISTE en Neon');
      console.log('\n📋 Usuarios existentes:');
      const allUsers = await client.query('SELECT id, email, name, role FROM users');
      allUsers.rows.forEach(u => {
        console.log(`  - ${u.email} (${u.role})`);
      });
    } else {
      const user = result.rows[0];
      console.log('✅ Usuario admin EXISTE:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password (preview): ${user.password_preview}`);
      console.log(`   Creado: ${user.created_at}`);

      // Verificar la contraseña esperada
      const bcrypt = require('bcryptjs');
      const fullPassword = await client.query(`SELECT password FROM users WHERE email = 'admin@aguamarina.com'`);
      const isValid = await bcrypt.compare('Admin@123', fullPassword.rows[0].password);

      console.log(`\n🔑 Verificación de contraseña:`);
      console.log(`   Contraseña "Admin@123" es válida: ${isValid ? '✅ SÍ' : '❌ NO'}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyAdmin();
