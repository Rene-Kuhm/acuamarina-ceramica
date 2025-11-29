#!/usr/bin/env node

const { Client } = require('pg');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function createAdmin() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado exitosamente\n');

    // Verificar si ya existe el admin
    const checkResult = await client.query(
      "SELECT id, email, role FROM users WHERE email = 'admin@aguamarina.com'"
    );

    if (checkResult.rows.length > 0) {
      console.log('ℹ️  Usuario admin ya existe:');
      console.log(`   Email: ${checkResult.rows[0].email}`);
      console.log(`   Role: ${checkResult.rows[0].role}`);
      console.log('\n✅ No es necesario crear el admin');
      return;
    }

    // Crear usuario admin
    // Contraseña: Admin@123 (hasheada con bcrypt)
    console.log('👤 Creando usuario admin...');

    // Primero obtener el próximo ID disponible
    const nextIdResult = await client.query("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users");
    const nextId = nextIdResult.rows[0].next_id;

    const result = await client.query(`
      INSERT INTO users (id, email, password, name, role, created_at, updated_at)
      VALUES (
        $1,
        'admin@aguamarina.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'Administrador',
        'admin',
        NOW(),
        NOW()
      )
      RETURNING id, email, name, role;
    `, [nextId]);

    console.log('✅ Usuario admin creado exitosamente:');
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Nombre: ${result.rows[0].name}`);
    console.log(`   Role: ${result.rows[0].role}`);
    console.log('\n🔑 Credenciales de login:');
    console.log('   Email: admin@aguamarina.com');
    console.log('   Contraseña: Admin@123');

    // Verificar total de usuarios
    const totalResult = await client.query('SELECT COUNT(*) as total FROM users');
    console.log(`\n👥 Total de usuarios en la base de datos: ${totalResult.rows[0].total}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
