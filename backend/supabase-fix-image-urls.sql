-- ============================================
-- FIX: Limpiar comillas escapadas en image_url
-- ============================================

-- Limpiar image_url en products (remover comillas escapadas)
UPDATE products
SET image_url = TRIM(BOTH '"' FROM image_url)
WHERE image_url LIKE '"%"';

-- Verificar resultado
SELECT
  id,
  name,
  image_url as fixed_url,
  LENGTH(image_url) as url_length
FROM products
ORDER BY id;

-- ============================================
-- 🎉 URLs LIMPIADAS
-- ============================================
