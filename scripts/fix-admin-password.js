#!/usr/bin/env node

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function fixAdminPassword() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    // Generar nuevo hash para Admin@123
    console.log('🔐 Generando hash correcto para "Admin@123"...');
    const newHash = await bcrypt.hash('Admin@123', 10);
    console.log(`✓ Hash generado: ${newHash.substring(0, 20)}...\n`);

    // Verificar que el hash es correcto
    const isValid = await bcrypt.compare('Admin@123', newHash);
    console.log(`🧪 Verificación del hash: ${isValid ? '✅ Válido' : '❌ Inválido'}\n`);

    if (!isValid) {
      console.error('❌ Error: El hash generado no es válido');
      process.exit(1);
    }

    // Actualizar la contraseña del admin
    console.log('📝 Actualizando contraseña del admin...');
    const result = await client.query(`
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE email = 'admin@aguamarina.com'
      RETURNING id, email, name, role
    `, [newHash]);

    if (result.rows.length === 0) {
      console.error('❌ Error: Usuario admin no encontrado');
      process.exit(1);
    }

    console.log('✅ Contraseña actualizada exitosamente:');
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Role: ${result.rows[0].role}`);

    // Verificar que ahora funciona
    console.log('\n🔍 Verificando login...');
    const verifyResult = await client.query(`
      SELECT id, email, password FROM users WHERE email = 'admin@aguamarina.com'
    `);

    const passwordMatches = await bcrypt.compare('Admin@123', verifyResult.rows[0].password);
    console.log(`✓ Password "Admin@123" válido: ${passwordMatches ? '✅ SÍ' : '❌ NO'}`);

    console.log('\n🎉 ¡Todo listo!');
    console.log('📝 Credenciales de login:');
    console.log('   Email: admin@aguamarina.com');
    console.log('   Password: Admin@123');
    console.log('\n🌐 Prueba en: https://admin.aguamarinamosaicos.com/login');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixAdminPassword();
