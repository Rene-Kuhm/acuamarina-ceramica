const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'aguamarina_mosaicos',
  user: 'postgres',
  password: '198540',
});

async function deleteUser() {
  try {
    await pool.query('DELETE FROM users WHERE email = $1', ['admin@aguamarina.com']);
    console.log('User deleted successfully');
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

deleteUser();
