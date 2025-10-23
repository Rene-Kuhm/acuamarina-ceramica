const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function cleanCategories() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🧹 Conectando a la base de datos...');

    // Primero, listar las categorías actuales
    const { rows: currentCategories } = await pool.query('SELECT id, name, slug FROM categories ORDER BY id');
    console.log('\n📋 Categorías actuales en la base de datos:');
    currentCategories.forEach(cat => {
      console.log(`  - ID: ${cat.id}, Nombre: ${cat.name}, Slug: ${cat.slug}`);
    });

    console.log('\n🗑️  Eliminando todas las categorías...');

    // Primero, eliminar las relaciones de productos con categorías
    const { rowCount: productsUpdated } = await pool.query('UPDATE products SET category_id = NULL WHERE category_id IS NOT NULL');
    console.log(`✓ Actualizados ${productsUpdated} productos (removida la categoría)`);

    // Luego, eliminar todas las categorías
    const { rowCount: categoriesDeleted } = await pool.query('DELETE FROM categories');
    console.log(`✓ Eliminadas ${categoriesDeleted} categorías`);

    // Reiniciar el contador de IDs
    await pool.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    console.log('✓ Contador de IDs reiniciado');

    console.log('\n✅ ¡Categorías eliminadas exitosamente!');
    console.log('Ahora puedes crear tus propias categorías desde el panel de administración.\n');

  } catch (error) {
    console.error('❌ Error al limpiar categorías:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanCategories();
