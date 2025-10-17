-- ============================================
-- AGREGAR COLUMNAS FALTANTES A LA TABLA PRODUCTS
-- ============================================
-- Ejecuta este script en Supabase SQL Editor
-- Es SEGURO: usa IF NOT EXISTS para no duplicar columnas
-- ============================================

-- Agregar columnas faltantes a products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100),
ADD COLUMN IF NOT EXISTS weight DECIMAL(8, 2),
ADD COLUMN IF NOT EXISTS material VARCHAR(100),
ADD COLUMN IF NOT EXISTS finish VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT;

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Verificar que las columnas se agregaron correctamente
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- ✅ Listo! Ahora la tabla products tiene todas las columnas necesarias
