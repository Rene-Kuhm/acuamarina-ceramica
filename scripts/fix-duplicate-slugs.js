/**
 * Script para corregir slugs duplicados en productos
 *
 * Uso:
 *   node scripts/fix-duplicate-slugs.js
 *
 * Requiere la variable de entorno DATABASE_URL configurada
 */

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL no está configurada');
  console.log('Configura la variable de entorno DATABASE_URL antes de ejecutar este script');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixDuplicateSlugs() {
  console.log('🔧 Iniciando corrección de slugs duplicados...\n');

  try {
    // Encontrar todos los slugs duplicados
    const duplicatesResult = await pool.query(`
      SELECT slug, COUNT(*) as count, array_agg(id ORDER BY id) as ids
      FROM products
      GROUP BY slug
      HAVING COUNT(*) > 1
    `);

    if (duplicatesResult.rows.length === 0) {
      console.log('✅ No se encontraron slugs duplicados');
      return;
    }

    console.log(`📋 Se encontraron ${duplicatesResult.rows.length} slug(s) duplicado(s):\n`);

    let fixedCount = 0;

    for (const row of duplicatesResult.rows) {
      const ids = row.ids;
      const baseSlug = row.slug;

      console.log(`  Slug: "${baseSlug}" - ${row.count} productos (IDs: ${ids.join(', ')})`);

      // El primer producto mantiene el slug original
      // Los demás reciben un sufijo numérico
      for (let i = 1; i < ids.length; i++) {
        const productId = ids[i];
        const newSlug = `${baseSlug}-${i + 1}`;

        await pool.query(
          'UPDATE products SET slug = $1 WHERE id = $2',
          [newSlug, productId]
        );

        console.log(`    ✅ Producto ${productId}: ${baseSlug} -> ${newSlug}`);
        fixedCount++;
      }
      console.log('');
    }

    console.log(`\n🎉 Corrección completada. ${fixedCount} slug(s) actualizado(s).`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixDuplicateSlugs();
