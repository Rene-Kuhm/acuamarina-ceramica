const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function testOrderCreation() {
  const client = await pool.connect();

  try {
    console.log('🧪 Probando creación de orden...\n');

    // Test data
    const orderNumber = `ORD-TEST-${Date.now()}`;
    const customerName = 'Juan Pérez';
    const customerEmail = 'juan@test.com';
    const customerPhone = '1234567890';
    const shippingAddress = JSON.stringify({
      street: 'Calle Falsa 123',
      city: 'Buenos Aires',
      state: 'CABA',
      zipCode: '1234',
      country: 'Argentina'
    });
    const totalAmount = 10000;
    const paymentMethod = 'credit_card';
    const notes = 'Test order';

    console.log('Datos de prueba:', {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      paymentMethod
    });

    await client.query('BEGIN');

    console.log('\nInsertando orden...');

    const orderResult = await client.query(
      `INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        shipping_address, total, total_amount, status, payment_method, payment_status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $6, 'pending', $7, 'pending', $8)
      RETURNING *`,
      [
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount,
        paymentMethod,
        notes,
      ]
    );

    console.log('✅ Orden creada:', orderResult.rows[0]);

    const orderId = orderResult.rows[0].id;

    console.log('\nInsertando item de orden...');

    // Get first product from database
    const productResult = await client.query('SELECT id, name, price FROM products LIMIT 1');

    if (productResult.rows.length === 0) {
      throw new Error('No hay productos en la base de datos para probar');
    }

    const product = productResult.rows[0];
    console.log('Usando producto:', product);

    await client.query(
      `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, price, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [orderId, product.id, product.name, product.price, 2, 5000, 10000]
    );

    console.log('✅ Item creado');

    await client.query('COMMIT');

    console.log('\n✅ ¡Orden de prueba creada exitosamente!');
    console.log('\nVerificando orden...');

    const verifyResult = await client.query(
      'SELECT * FROM orders WHERE order_number = $1',
      [orderNumber]
    );

    console.table(verifyResult.rows);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error:', error.message);
    console.error('\nDetalles:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testOrderCreation();
