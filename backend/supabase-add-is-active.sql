-- ============================================
-- FIX: Agregar columna is_active faltante
-- ============================================
-- Ejecutar este script en Supabase SQL Editor
-- ============================================

-- Agregar is_active a categories
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Agregar is_active a products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Actualizar productos y categorías existentes
UPDATE categories SET is_active = true WHERE is_active IS NULL;
UPDATE products SET is_active = true WHERE is_active IS NULL;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
  '✅ Columna is_active agregada a categories' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'categories' AND column_name = 'is_active'
);

SELECT
  '✅ Columna is_active agregada a products' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'products' AND column_name = 'is_active'
);

-- Verificar datos
SELECT 'categories' as tabla, COUNT(*) as total, COUNT(*) FILTER (WHERE is_active = true) as activos
FROM categories
UNION ALL
SELECT 'products', COUNT(*), COUNT(*) FILTER (WHERE is_active = true)
FROM products;

-- ============================================
-- 🎉 FIX COMPLETADO
-- ============================================
