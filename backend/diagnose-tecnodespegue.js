const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function diagnoseTecnodespegue() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 DIAGNÓSTICO: PRODUCTO TECNODESPEGUE');
    console.log('═══════════════════════════════════════════════════════\n');

    // 1. Buscar el producto
    console.log('📦 1. BÚSQUEDA DEL PRODUCTO:');
    console.log('─────────────────────────────────────────────────────');
    const productResult = await pool.query(`
      SELECT * FROM products
      WHERE name ILIKE '%tecnodespegue%'
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (productResult.rows.length === 0) {
      console.log('❌ No se encontró el producto "Tecnodespegue"');
      console.log('   Verifica que el producto se haya creado correctamente.\n');
      return;
    }

    const product = productResult.rows[0];
    console.log('✅ Producto encontrado:');
    console.log(`   - ID: ${product.id}`);
    console.log(`   - Nombre: ${product.name}`);
    console.log(`   - SKU: ${product.sku}`);
    console.log(`   - is_active: ${product.is_active}`);
    console.log(`   - stock_quantity: ${product.stock_quantity}`);
    console.log(`   - created_at: ${product.created_at}`);
    console.log('');

    // 2. Verificar imágenes en product_images
    console.log('🖼️  2. VERIFICACIÓN DE IMÁGENES EN TABLA product_images:');
    console.log('─────────────────────────────────────────────────────');
    const imagesResult = await pool.query(`
      SELECT * FROM product_images
      WHERE product_id = $1
      ORDER BY display_order
    `, [product.id]);

    if (imagesResult.rows.length === 0) {
      console.log('❌ NO HAY IMÁGENES vinculadas a este producto en la tabla product_images');
      console.log('   Este es el problema principal.\n');
    } else {
      console.log(`✅ ${imagesResult.rows.length} imagen(es) encontrada(s):`);
      imagesResult.rows.forEach((img, i) => {
        console.log(`\n   ${i + 1}. Imagen ID: ${img.id}`);
        console.log(`      - url: ${img.url}`);
        console.log(`      - is_primary: ${img.is_primary}`);
        console.log(`      - display_order: ${img.display_order}`);
        console.log(`      - created_at: ${img.created_at}`);
      });
      console.log('');
    }

    // 3. Verificar todas las tablas de imágenes
    console.log('🔎 3. BÚSQUEDA EN TODAS LAS TABLAS DE IMÁGENES:');
    console.log('─────────────────────────────────────────────────────');

    // Verificar si hay otras tablas de imágenes
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE '%image%'
      ORDER BY table_name
    `);

    console.log('Tablas relacionadas con imágenes:');
    tablesResult.rows.forEach(t => console.log(`   - ${t.table_name}`));
    console.log('');

    // 4. Verificar estructura de la tabla product_images
    console.log('📋 4. ESTRUCTURA DE product_images:');
    console.log('─────────────────────────────────────────────────────');
    const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'product_images'
      ORDER BY ordinal_position
    `);

    schemaResult.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    console.log('');

    // 5. Simular la respuesta del endpoint
    console.log('📤 5. SIMULACIÓN DE RESPUESTA DEL ENDPOINT /products/:id:');
    console.log('─────────────────────────────────────────────────────');
    const images = imagesResult.rows.map(img => img.url);

    const apiResponse = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      isActive: product.is_active,
      stockQuantity: product.stock_quantity,
      images: images,
    };

    console.log(JSON.stringify(apiResponse, null, 2));
    console.log('');

    // 6. Diagnóstico final
    console.log('🎯 6. DIAGNÓSTICO FINAL:');
    console.log('─────────────────────────────────────────────────────');
    if (imagesResult.rows.length === 0) {
      console.log('❌ PROBLEMA CONFIRMADO: Las imágenes NO se están guardando en product_images');
      console.log('');
      console.log('📝 POSIBLES CAUSAS:');
      console.log('   1. Error en el proceso de upload a Cloudinary');
      console.log('   2. Error en el proceso de vinculación (linkImagesToProduct)');
      console.log('   3. El frontend no está llamando correctamente al endpoint');
      console.log('   4. Error de autenticación/autorización');
      console.log('');
      console.log('🔧 PRÓXIMO PASO:');
      console.log('   - Revisar logs del backend durante la creación del producto');
      console.log('   - Verificar las llamadas HTTP del frontend');
      console.log('   - Probar el endpoint de upload manualmente');
    } else {
      console.log('✅ Las imágenes SÍ están en la base de datos');
      console.log('   El problema debe estar en el frontend o en la transformación de datos');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ DIAGNÓSTICO COMPLETO');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

diagnoseTecnodespegue();
