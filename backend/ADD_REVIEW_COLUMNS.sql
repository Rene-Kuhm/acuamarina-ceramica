-- Migración para agregar columnas faltantes a la tabla reviews
-- Ejecutar en Supabase SQL Editor

-- Agregar columna title (opcional)
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS title VARCHAR(100);

-- Agregar columna verified_purchase (compra verificada)
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false;

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reviews'
ORDER BY ordinal_position;
