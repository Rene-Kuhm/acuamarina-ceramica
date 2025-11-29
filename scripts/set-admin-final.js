#!/usr/bin/env node

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Generar contraseña segura
function generateSecurePassword() {
  const length = 16;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@$!%*?&';

  const all = uppercase + lowercase + numbers + special;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Mezclar
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

async function setFinalAdmin() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    const email = 'admin@aguamarina.com';
    const name = 'Administrador Aguamarina';
    const password = generateSecurePassword();

    console.log('🔐 Generando hash seguro (12 rounds)...');
    const passwordHash = await bcrypt.hash(password, 12);
    console.log('✓ Hash generado\n');

    // Verificar que el hash funciona
    console.log('🧪 Verificando hash...');
    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      console.error('❌ Error: Hash inválido');
      process.exit(1);
    }
    console.log('✓ Hash verificado correctamente\n');

    // Actualizar admin existente
    console.log('📝 Actualizando usuario administrador...');
    const result = await client.query(`
      UPDATE users
      SET password = $1,
          name = $2,
          updated_at = NOW()
      WHERE email = $3
      RETURNING id, email, name, role
    `, [passwordHash, name, email]);

    if (result.rows.length === 0) {
      console.error('❌ Usuario admin no encontrado');
      process.exit(1);
    }

    console.log('✓ Usuario actualizado\n');

    // Verificar login con las nuevas credenciales
    console.log('🔍 Verificando credenciales...');
    const verifyUser = await client.query('SELECT password FROM users WHERE email = $1', [email]);
    const loginWorks = await bcrypt.compare(password, verifyUser.rows[0].password);

    if (!loginWorks) {
      console.error('❌ ERROR CRÍTICO: Las credenciales no funcionan');
      process.exit(1);
    }

    console.log('✓ Credenciales verificadas\n');

    console.log('='.repeat(70));
    console.log('   ✅ USUARIO ADMINISTRADOR CONFIGURADO CORRECTAMENTE');
    console.log('='.repeat(70));
    console.log('');
    console.log(`   ID:     ${result.rows[0].id}`);
    console.log(`   Email:  ${result.rows[0].email}`);
    console.log(`   Nombre: ${result.rows[0].name}`);
    console.log(`   Role:   ${result.rows[0].role}`);
    console.log('');
    console.log('='.repeat(70));
    console.log('   🔒 CREDENCIALES DE ACCESO');
    console.log('='.repeat(70));
    console.log('');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('='.repeat(70));
    console.log('');
    console.log('   ⚠️  IMPORTANTE: Guarda esta contraseña en un lugar seguro');
    console.log('   ⚠️  Esta contraseña NO se volverá a mostrar');
    console.log('');
    console.log('   🌐 URL de login: https://admin.aguamarinamosaicos.com/login');
    console.log('');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setFinalAdmin();
