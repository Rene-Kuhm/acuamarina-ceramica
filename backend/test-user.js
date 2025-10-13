const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'aguamarina_mosaicos',
  user: 'postgres',
  password: '198540',
});

async function testUser() {
  try {
    // Check if user exists
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
      ['admin@aguamarina.com']
    );

    console.log('Query result:', result.rows);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('\nUser found:');
      console.log('- Email:', user.email);
      console.log('- Name:', user.first_name, user.last_name);
      console.log('- Role:', user.role);
      console.log('- Active:', user.is_active);

      // Test password
      const testPassword = 'Admin123!';
      const match = await bcrypt.compare(testPassword, user.password_hash);
      console.log('\nPassword "Admin123!" matches:', match);
    } else {
      console.log('No user found with email admin@aguamarina.com');
    }

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

testUser();
