#!/usr/bin/env node

const { Client } = require('pg');

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function deleteSampleOrders() {
  const client = new Client({
    connectionString: NEON_CONNECTION_STRING,
  });

  try {
    console.log('🔌 Conectando a Neon...');
    await client.connect();
    console.log('✓ Conectado\n');

    // Ver cuántos pedidos hay
    const countResult = await client.query('SELECT COUNT(*) as total FROM orders');
    console.log(`📊 Total de pedidos actuales: ${countResult.rows[0].total}\n`);

    // Mostrar pedidos
    const ordersResult = await client.query(`
      SELECT id, order_number, customer_name, customer_email, total_amount, created_at
      FROM orders
      ORDER BY created_at DESC
    `);

    console.log('📋 Pedidos en la base de datos:');
    console.log('='.repeat(100));
    ordersResult.rows.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('es-ES');
      console.log(`ID: ${order.id} | ${order.order_number} | ${order.customer_name || 'N/A'} | Total: $${order.total_amount} | ${date}`);
    });
    console.log('='.repeat(100));
    console.log('');

    // Eliminar todos los order_items primero (foreign key constraint)
    console.log('🗑️  Eliminando items de pedidos...');
    const deleteItemsResult = await client.query('DELETE FROM order_items');
    console.log(`   ✓ ${deleteItemsResult.rowCount} items eliminados\n`);

    // Eliminar todos los pedidos
    console.log('🗑️  Eliminando pedidos...');
    const deleteOrdersResult = await client.query('DELETE FROM orders');
    console.log(`   ✓ ${deleteOrdersResult.rowCount} pedidos eliminados\n`);

    // Verificar que se eliminaron
    const finalCount = await client.query('SELECT COUNT(*) as total FROM orders');
    console.log('='.repeat(100));
    console.log(`   ✅ PEDIDOS ELIMINADOS EXITOSAMENTE`);
    console.log('='.repeat(100));
    console.log(`   Pedidos restantes: ${finalCount.rows[0].total}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

deleteSampleOrders();
