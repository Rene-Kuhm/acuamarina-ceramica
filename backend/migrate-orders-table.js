const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function migrateOrdersTable() {
  const client = await pool.connect();

  try {
    console.log('🔧 Migrando tabla orders...\n');

    await client.query('BEGIN');

    // Add missing columns to orders table
    console.log('Agregando columnas faltantes a orders...');

    await client.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS order_number VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;
    `);

    console.log('✅ Columnas agregadas');

    // Add index on order_number
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
    `);

    console.log('✅ Índice creado en order_number');

    // Add index on customer_email
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
    `);

    console.log('✅ Índice creado en customer_email');

    // Update order_items to add price column
    console.log('\nActualizando tabla order_items...');

    await client.query(`
      ALTER TABLE order_items
      ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);
    `);

    console.log('✅ Columna price agregada a order_items');

    // Update existing order_items to copy product_price to price
    await client.query(`
      UPDATE order_items
      SET price = product_price
      WHERE price IS NULL;
    `);

    console.log('✅ Datos migrados de product_price a price');

    await client.query('COMMIT');

    // Verify changes
    console.log('\n🔍 Verificando cambios...\n');

    const ordersColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);

    console.log('Columnas en orders:');
    console.table(ordersColumns.rows);

    const itemsColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'order_items'
      ORDER BY ordinal_position;
    `);

    console.log('\nColumnas en order_items:');
    console.table(itemsColumns.rows);

    console.log('\n✅ ¡Migración completada exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateOrdersTable();
