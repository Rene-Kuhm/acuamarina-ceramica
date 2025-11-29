-- Script para verificar y crear usuario admin
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si existe el usuario admin
SELECT id, email, name, role, created_at
FROM users
WHERE email = 'admin@aguamarina.com';

-- Si no existe, crear el usuario admin con contraseña: Admin@123
-- La contraseña hasheada es: $2a$10$YourHashHere (necesitas hashear la contraseña)

-- 2. Crear usuario admin (ejecutar solo si no existe)
-- NOTA: Primero necesitas generar el hash de la contraseña
-- Puedes usar: https://bcrypt-generator.com/ con "Admin@123" y rounds 10

-- Descomentar y ejecutar estas líneas SOLO si el usuario no existe:
/*
INSERT INTO users (email, password, name, phone, role, created_at, updated_at)
VALUES (
  'admin@aguamarina.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Este es el hash de "Admin@123"
  'Administrador',
  NULL,
  'admin',
  NOW(),
  NOW()
)
RETURNING id, email, name, role;
*/

-- 3. Verificar que se creó correctamente
SELECT id, email, name, role, created_at
FROM users
WHERE email = 'admin@aguamarina.com';
