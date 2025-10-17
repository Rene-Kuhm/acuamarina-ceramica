-- ============================================
-- FIX: Agregar tablas y columnas faltantes
-- ============================================
-- Ejecutar este script en Supabase SQL Editor
-- ============================================

-- 1. Agregar columna parent_id a categories (para subcategorías)
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- 2. Crear tabla product_images (para múltiples imágenes por producto)
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(display_order);

-- 3. Trigger para updated_at en product_images
CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Migrar imágenes existentes de products.images a product_images
-- (solo si hay productos con imágenes en el campo JSONB)
INSERT INTO product_images (product_id, url, is_primary, display_order)
SELECT
  p.id,
  jsonb_array_elements_text(p.images),
  true,
  0
FROM products p
WHERE jsonb_array_length(p.images) > 0
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
  '✅ Columna parent_id agregada a categories' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'categories' AND column_name = 'parent_id'
);

SELECT
  '✅ Tabla product_images creada' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_name = 'product_images'
);

-- Mostrar productos con sus imágenes
SELECT
  p.name as producto,
  COUNT(pi.id) as imagenes_migradas
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.name
ORDER BY p.id;

-- ============================================
-- 🎉 FIX COMPLETADO
-- ============================================
