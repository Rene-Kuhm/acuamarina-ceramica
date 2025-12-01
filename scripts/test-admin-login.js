const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const NEON_URL = 'postgresql://neondb_owner:npg_gd1Ncxk8moQt@ep-lively-paper-adkpb6f5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function testAdminPassword() {
  const pool = new Pool({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT id, email, password, role FROM users WHERE email = $1', ['admin@aguamarina.com']);

    if (result.rows.length === 0) {
      console.log('User admin not found');
      return;
    }

    const user = result.rows[0];
    console.log('\nUser found:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password hash:', user.password.substring(0, 20) + '...');

    const passwords = ['Admin@123', 'admin123', 'Aguamarina@123'];

    console.log('\nTesting passwords...');
    for (const pwd of passwords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      const status = isValid ? 'VALID' : 'invalid';
      console.log(`  ${pwd}: ${status}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testAdminPassword();
