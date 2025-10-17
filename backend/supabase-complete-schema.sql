-- ============================================
-- SCHEMA COMPLETO - AGUAMARINA CERAMICOS
-- ============================================
-- Este script agrega TODAS las columnas y tablas faltantes
-- Es SEGURO ejecutarlo: usa IF NOT EXISTS para evitar conflictos
-- ============================================

-- 1. CATEGORIES - Agregar columnas faltantes
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Índices para categories
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

-- 2. PRODUCTS - Agregar columnas faltantes
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount_price);

-- 3. PRODUCT_IMAGES - Crear tabla si no existe
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

-- 4. CUSTOMERS - Tabla de clientes (diferente de users)
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(is_active);

-- 5. Actualizar datos existentes
UPDATE categories SET is_active = true WHERE is_active IS NULL;
UPDATE products SET is_active = true WHERE is_active IS NULL;

-- 6. Migrar imágenes de products.images a product_images (si no se hizo antes)
INSERT INTO product_images (product_id, url, is_primary, display_order)
SELECT
  p.id,
  jsonb_array_elements_text(p.images) as url,
  true as is_primary,
  0 as display_order
FROM products p
WHERE jsonb_array_length(p.images) > 0
  AND NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
  )
ON CONFLICT DO NOTHING;

-- 7. Triggers para updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_images_updated_at'
  ) THEN
    CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_customers_updated_at'
  ) THEN
    CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================
-- VERIFICACIÓN COMPLETA
-- ============================================

-- Verificar estructura de categories
SELECT
  'categories' as tabla,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;

-- Verificar estructura de products
SELECT
  'products' as tabla,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Verificar todas las tablas
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar datos
SELECT 'users' as tabla, COUNT(*) as registros FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'product_images', COUNT(*) FROM product_images
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs;

-- ============================================
-- 🎉 SCHEMA COMPLETO Y ACTUALIZADO
-- ============================================
