const { Pool } = require('pg');

// Configuración de conexión desde .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function checkAndFixSchema() {
  const client = await pool.connect();

  try {
    console.log('🔍 Conectado a la base de datos...\n');

    // PASO 1: Verificar esquema actual
    console.log('📋 PASO 1: Verificando esquema actual de la tabla users...');
    const schemaCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('\n✅ Esquema actual:');
    console.table(schemaCheck.rows);

    // PASO 2: Verificar roles actuales
    console.log('\n📋 PASO 2: Verificando roles actuales...');
    const rolesCheck = await client.query('SELECT DISTINCT role FROM users;');
    console.log('Roles encontrados:', rolesCheck.rows.map(r => r.role).join(', '));

    // Determinar si necesita fix
    const hasFirstName = schemaCheck.rows.some(r => r.column_name === 'first_name');
    const hasPasswordHash = schemaCheck.rows.some(r => r.column_name === 'password_hash');
    const hasName = schemaCheck.rows.some(r => r.column_name === 'name');
    const hasPassword = schemaCheck.rows.some(r => r.column_name === 'password');

    console.log('\n🔍 Análisis:');
    console.log('- Tiene first_name:', hasFirstName);
    console.log('- Tiene password_hash:', hasPasswordHash);
    console.log('- Tiene name:', hasName);
    console.log('- Tiene password:', hasPassword);

    if (hasFirstName && hasPasswordHash) {
      console.log('\n⚠️  NECESITA FIX: La tabla tiene first_name/last_name/password_hash');
      console.log('💡 Aplicando corrección...\n');

      // Revertir a esquema simple
      console.log('🔧 Eliminando columnas migradas...');
      await client.query(`
        ALTER TABLE users
          DROP COLUMN IF EXISTS first_name CASCADE,
          DROP COLUMN IF EXISTS last_name CASCADE,
          DROP COLUMN IF EXISTS is_active CASCADE,
          DROP COLUMN IF EXISTS email_verified CASCADE,
          DROP COLUMN IF EXISTS last_login CASCADE;
      `);
      console.log('✅ Columnas eliminadas\n');

      // Renombrar password_hash a password
      console.log('🔧 Renombrando password_hash a password...');
      const passwordHashExists = await client.query(`
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password_hash'
      `);

      if (passwordHashExists.rows.length > 0) {
        await client.query('ALTER TABLE users RENAME COLUMN password_hash TO password;');
        console.log('✅ Campo renombrado\n');
      }

      // Asegurar que name existe
      console.log('🔧 Asegurando que el campo name existe...');
      await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);');
      console.log('✅ Campo name verificado\n');

    } else if (!hasName && !hasPassword) {
      console.log('\n✅ El esquema parece correcto, pero faltan campos básicos');
    } else {
      console.log('\n✅ El esquema ya está en el formato correcto (name/password)');
    }

    // PASO 3: Actualizar CHECK constraint del rol
    console.log('🔧 Actualizando CHECK constraint del rol...');
    await client.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;');
    await client.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check
        CHECK (role IN ('user', 'admin'));
    `);
    console.log('✅ CHECK constraint actualizado\n');

    // Actualizar roles 'customer' a 'user'
    console.log('🔧 Convirtiendo roles "customer" a "user"...');
    const updateResult = await client.query(`
      UPDATE users SET role = 'user' WHERE role = 'customer';
    `);
    console.log(`✅ ${updateResult.rowCount} roles actualizados\n`);

    // PASO 4: Verificación final
    console.log('📋 VERIFICACIÓN FINAL:');
    const finalSchema = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('\n✅ Esquema final:');
    console.table(finalSchema.rows);

    const finalRoles = await client.query('SELECT DISTINCT role FROM users;');
    console.log('\n✅ Roles finales:', finalRoles.rows.map(r => r.role).join(', '));

    console.log('\n🎉 ¡Corrección completada exitosamente!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDetalles:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAndFixSchema();
