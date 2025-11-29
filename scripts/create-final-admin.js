#!/usr/bin/env node

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createFinalAdmin() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    console.log('='.repeat(60));
    console.log('   CREACIÓN DE USUARIO ADMINISTRADOR DEFINITIVO');
    console.log('='.repeat(60));
    console.log('');

    // Solicitar email
    const email = await question('📧 Email del administrador: ');
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido');
      process.exit(1);
    }

    // Solicitar contraseña
    console.log('\n🔒 La contraseña debe tener:');
    console.log('   - Mínimo 8 caracteres');
    console.log('   - Al menos una mayúscula');
    console.log('   - Al menos una minúscula');
    console.log('   - Al menos un número');
    console.log('   - Al menos un carácter especial (@$!%*?&)\n');

    const password = await question('🔑 Contraseña: ');
    if (password.length < 8) {
      console.error('❌ La contraseña debe tener al menos 8 caracteres');
      process.exit(1);
    }

    const passwordConfirm = await question('🔁 Confirmar contraseña: ');
    if (password !== passwordConfirm) {
      console.error('❌ Las contraseñas no coinciden');
      process.exit(1);
    }

    // Solicitar nombre
    const name = await question('\n👤 Nombre completo: ');
    if (!name || name.trim().length < 2) {
      console.error('❌ Nombre inválido');
      process.exit(1);
    }

    rl.close();

    console.log('\n🔄 Procesando...\n');

    // Verificar si ya existe un admin
    const existingAdmin = await client.query(
      "SELECT id, email FROM users WHERE role = 'admin'"
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Ya existe un usuario admin:', existingAdmin.rows[0].email);
      console.log('   Se actualizará el usuario existente\n');

      // Generar hash de contraseña
      console.log('🔐 Generando hash seguro de contraseña...');
      const passwordHash = await bcrypt.hash(password, 12); // 12 rounds para mayor seguridad
      console.log('✓ Hash generado\n');

      // Verificar hash
      const isValid = await bcrypt.compare(password, passwordHash);
      if (!isValid) {
        console.error('❌ Error: Hash inválido');
        process.exit(1);
      }
      console.log('✓ Hash verificado\n');

      // Actualizar admin existente
      const result = await client.query(`
        UPDATE users
        SET email = $1,
            password = $2,
            name = $3,
            updated_at = NOW()
        WHERE role = 'admin'
        RETURNING id, email, name, role, created_at
      `, [email, passwordHash, name]);

      console.log('='.repeat(60));
      console.log('   ✅ USUARIO ADMINISTRADOR ACTUALIZADO');
      console.log('='.repeat(60));
      console.log('');
      console.log(`   ID:     ${result.rows[0].id}`);
      console.log(`   Email:  ${result.rows[0].email}`);
      console.log(`   Nombre: ${result.rows[0].name}`);
      console.log(`   Role:   ${result.rows[0].role}`);
      console.log('');

    } else {
      // Crear nuevo admin
      console.log('🔐 Generando hash seguro de contraseña...');
      const passwordHash = await bcrypt.hash(password, 12);
      console.log('✓ Hash generado\n');

      // Verificar hash
      const isValid = await bcrypt.compare(password, passwordHash);
      if (!isValid) {
        console.error('❌ Error: Hash inválido');
        process.exit(1);
      }
      console.log('✓ Hash verificado\n');

      // Obtener próximo ID
      const nextIdResult = await client.query("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users");
      const nextId = nextIdResult.rows[0].next_id;

      const result = await client.query(`
        INSERT INTO users (id, email, password, name, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'admin', NOW(), NOW())
        RETURNING id, email, name, role, created_at
      `, [nextId, email, passwordHash, name]);

      console.log('='.repeat(60));
      console.log('   ✅ USUARIO ADMINISTRADOR CREADO');
      console.log('='.repeat(60));
      console.log('');
      console.log(`   ID:     ${result.rows[0].id}`);
      console.log(`   Email:  ${result.rows[0].email}`);
      console.log(`   Nombre: ${result.rows[0].name}`);
      console.log(`   Role:   ${result.rows[0].role}`);
      console.log('');
    }

    console.log('🔒 CREDENCIALES DE ACCESO:');
    console.log('='.repeat(60));
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('='.repeat(60));
    console.log('');
    console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro');
    console.log('');
    console.log('🌐 URL de login: https://admin.aguamarinamosaicos.com/login');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createFinalAdmin();
