-- ============================================
-- FIX: Agregar columna image_url a products
-- ============================================

-- Agregar image_url a products (imagen principal del producto)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Migrar la primera imagen del JSONB images a image_url
UPDATE products
SET image_url = (images->0)::text
WHERE image_url IS NULL
  AND jsonb_array_length(images) > 0;

-- Si no hay imágenes en el JSONB, usar una imagen por defecto
UPDATE products
SET image_url = '/images/products/default.jpg'
WHERE image_url IS NULL;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_products_image ON products(image_url);

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
  '✅ Columna image_url agregada a products' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'products' AND column_name = 'image_url'
);

-- Verificar productos con sus imágenes
SELECT
  id,
  name,
  image_url,
  jsonb_array_length(images) as total_images
FROM products
ORDER BY id;

-- ============================================
-- 🎉 FIX COMPLETADO
-- ============================================
