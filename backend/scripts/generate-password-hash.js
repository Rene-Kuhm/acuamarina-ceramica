// Script para generar hash de contraseña
// Ejecutar: node generate-password-hash.js

const bcrypt = require('bcryptjs');

const password = 'Admin123!';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }

  console.log('=========================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('=========================================');
  console.log('\nSQL para actualizar usuario:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@aguamarina.com';`);
  console.log('=========================================');
});
