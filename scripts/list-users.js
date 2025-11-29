const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

client.connect().then(async () => {
  const result = await client.query('SELECT id, email, name, role FROM users ORDER BY id');
  console.log('\nUsuarios en Neon:');
  console.log('='.repeat(80));
  result.rows.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Nombre: ${u.name} | Role: ${u.role}`);
  });
  console.log('='.repeat(80));
  console.log(`Total: ${result.rows.length} usuarios\n`);
  await client.end();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
