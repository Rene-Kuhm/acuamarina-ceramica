const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function addMercadoPagoField() {
  const client = await pool.connect();

  try {
    console.log('🔍 Agregando campo mercadopago_payment_id a la tabla orders...\n');

    // Add field
    await client.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR(255);
    `);
    console.log('✅ Campo agregado');

    // Add index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_mercadopago_payment_id
      ON orders(mercadopago_payment_id);
    `);
    console.log('✅ Índice creado');

    // Verify
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'orders' AND column_name = 'mercadopago_payment_id';
    `);

    console.log('\n✅ Verificación:');
    console.table(result.rows);

    console.log('\n🎉 ¡Campo agregado exitosamente!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addMercadoPagoField();
