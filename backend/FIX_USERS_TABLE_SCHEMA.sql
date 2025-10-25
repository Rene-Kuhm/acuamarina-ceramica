-- ============================================
-- FIX: Alinear esquema de tabla users con el código
-- ============================================
-- Este script asegura que la tabla users tenga el esquema
-- correcto para que funcione con el AuthController actual
-- ============================================

-- PASO 1: Verificar el esquema actual
SELECT
  'Esquema actual de users:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- PASO 2: Verificar valores del rol actual
SELECT DISTINCT role FROM users;

-- ============================================
-- OPCIÓN A: Si la tabla tiene first_name/last_name/password_hash
-- ============================================
-- Ejecutar esto SI ves first_name, last_name y password_hash en el esquema:

-- Revertir a esquema simple
ALTER TABLE users
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS email_verified,
  DROP COLUMN IF EXISTS last_login;

-- Renombrar password_hash de vuelta a password (si existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password'
  ) THEN
    ALTER TABLE users RENAME COLUMN password_hash TO password;
  END IF;
END $$;

-- Asegurar que el campo name existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Migrar datos si first_name existe
UPDATE users
SET name = COALESCE(first_name, name) || COALESCE(' ' || last_name, '')
WHERE name IS NULL OR name = '';

-- Hacer name NOT NULL
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- ============================================
-- PASO 3: Actualizar el CHECK constraint del rol
-- ============================================
-- Primero, quitar el constraint existente
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Crear nuevo constraint que permita 'user' y 'admin' (NO 'customer')
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'admin'));

-- Actualizar cualquier 'customer' existente a 'user'
UPDATE users SET role = 'user' WHERE role = 'customer';

-- ============================================
-- PASO 4: Verificación final
-- ============================================
SELECT
  'Esquema ACTUALIZADO de users:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT 'Roles actuales en la tabla:' as info, DISTINCT role FROM users;

SELECT '✅ Tabla users actualizada correctamente para funcionar con AuthController' as status;
