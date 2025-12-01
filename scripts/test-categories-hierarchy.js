const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function testCategoriesHierarchy() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n📊 ANÁLISIS DE CATEGORÍAS\n');

    // 1. Ver todas las categorías
    console.log('1️⃣ Todas las categorías:\n');
    const all = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        pc.name as parent_name,
        c.is_active,
        c.display_order,
        (SELECT COUNT(*) FROM categories WHERE parent_id = c.id) as subcategories_count
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      ORDER BY c.parent_id NULLS FIRST, c.display_order, c.name;
    `);

    console.table(all.rows);

    // 2. Solo categorías padre
    console.log('\n2️⃣ Categorías PADRE (parent_id IS NULL):\n');
    const parents = await pool.query(`
      SELECT 
        id,
        name,
        is_active,
        (SELECT COUNT(*) FROM categories WHERE parent_id = c.id) as children_count
      FROM categories c
      WHERE parent_id IS NULL
      ORDER BY display_order, name;
    `);

    console.table(parents.rows);

    // 3. Solo subcategorías
    console.log('\n3️⃣ SUBCATEGORÍAS (parent_id IS NOT NULL):\n');
    const children = await pool.query(`
      SELECT 
        c.id,
        c.name,
        pc.name as parent_category,
        c.is_active
      FROM categories c
      INNER JOIN categories pc ON c.parent_id = pc.id
      ORDER BY pc.name, c.name;
    `);

    console.table(children.rows);

    // 4. Probar filtro activo/inactivo
    console.log('\n4️⃣ Filtro por ACTIVAS (is_active = true):\n');
    const active = await pool.query(`
      SELECT id, name, parent_id, is_active
      FROM categories
      WHERE is_active = true
      ORDER BY parent_id NULLS FIRST, name;
    `);

    console.table(active.rows);

    // 5. Crear categoría INACTIVA para probar
    console.log('\n5️⃣ Creando categoría INACTIVA para prueba...\n');
    const inactive = await pool.query(`
      INSERT INTO categories (
        name, slug, description, parent_id, is_active, display_order,
        created_at, updated_at
      ) VALUES (
        'Categoría Desactivada Test',
        'categoria-desactivada-test',
        'Esta es una categoría de prueba desactivada',
        NULL,
        false,
        99,
        NOW(),
        NOW()
      )
      RETURNING id, name, is_active;
    `);

    console.log('Categoría inactiva creada:');
    console.table(inactive.rows);

    // 6. Verificar query del backend (simulación)
    console.log('\n6️⃣ Query del backend (includeInactive=false):\n');
    const backendQuery = await pool.query(`
      SELECT
        c.*,
        pc.name as parent_name,
        (SELECT COUNT(*) FROM products WHERE category_id = c.id) as products_count
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      WHERE c.is_active = true
      ORDER BY c.display_order, c.name;
    `);

    console.log(`Categorías activas: ${backendQuery.rows.length}`);
    console.table(backendQuery.rows.map(r => ({
      id: r.id,
      name: r.name,
      parent: r.parent_name || 'PADRE',
      active: r.is_active,
      order: r.display_order
    })));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testCategoriesHierarchy();
