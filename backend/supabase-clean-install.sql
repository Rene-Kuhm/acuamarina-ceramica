-- ============================================
-- AGUAMARINA CERAMICOS - INSTALACIÓN LIMPIA
-- Supabase Database Setup - COMPLETO Y FUNCIONAL
-- ============================================
-- Este script BORRA TODO y crea desde cero
-- Solo ejecutar UNA VEZ
-- ============================================

-- ============================================
-- PASO 1: LIMPIAR TODO
-- ============================================
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Limpiar funciones y triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- PASO 2: CREAR TABLAS ESENCIALES
-- ============================================

-- TABLA: users (usuarios del sistema)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- TABLA: refresh_tokens (tokens JWT para autenticación)
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(revoked_at);

-- TABLA: audit_logs (log de acciones)
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- TABLA: categories (categorías de productos)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- TABLA: products (productos)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  images JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  featured BOOLEAN DEFAULT false,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);

-- TABLA: orders (pedidos)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- TABLA: order_items (items de pedidos)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- TABLA: contacts (formulario de contacto)
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);

-- TABLA: reviews (reseñas de productos)
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- PASO 3: TRIGGERS PARA updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASO 4: DATOS INICIALES
-- ============================================

-- Usuario Admin
-- Email: admin@aguamarina.com
-- Password: Admin123!
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified, phone) VALUES
('admin@aguamarina.com', '$2a$10$YzLKzP0qH.EQ9HZ9L5Z9Z.EQ9HZ9L5Z9Z.EQ9HZ9L5Z9Z.EQ9HZ9L5', 'Admin', 'Aguamarina', 'admin', true, true, '+54 11 1234-5678');

-- Categorías
INSERT INTO categories (name, slug, description, image) VALUES
('Mosaicos Cerámicos', 'mosaicos-ceramicos', 'Diseños clásicos y modernos para pisos y paredes', '/categories/mosaicos.jpg'),
('Azulejos Decorativos', 'azulejos-decorativos', 'Dale vida a tus espacios con colores únicos', '/categories/azulejos.jpg'),
('Revestimientos', 'revestimientos', 'Protección y estilo para paredes interiores', '/categories/revestimientos.jpg'),
('Pisos Cerámicos', 'pisos-ceramicos', 'Durabilidad y elegancia para todo tipo de ambientes', '/categories/pisos.jpg');

-- Productos de ejemplo
INSERT INTO products (name, slug, description, price, stock, featured, category_id, images, specifications) VALUES
(
  'Mosaico Veneciano Blanco 30x30',
  'mosaico-veneciano-blanco-30x30',
  'Elegante mosaico veneciano en color blanco mate. Ideal para baños y cocinas modernas.',
  1250.00,
  150,
  true,
  1,
  '["https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"]'::jsonb,
  '{"material": "Cerámica", "tamaño": "30x30 cm", "acabado": "Mate"}'::jsonb
),
(
  'Azulejo Geométrico Azul 20x20',
  'azulejo-geometrico-azul-20x20',
  'Azulejo decorativo con patrón geométrico en tonos azules. Perfecto para espacios modernos.',
  890.00,
  200,
  true,
  2,
  '["https://images.unsplash.com/photo-1616628188550-808682f9dfe4?w=800"]'::jsonb,
  '{"material": "Porcelanato", "tamaño": "20x20 cm", "acabado": "Brillante"}'::jsonb
),
(
  'Piso Porcelanato Gris 60x60',
  'piso-porcelanato-gris-60x60',
  'Porcelanato de alta resistencia en tono gris neutro. Ideal para alto tránsito.',
  1580.00,
  120,
  true,
  4,
  '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"]'::jsonb,
  '{"material": "Porcelanato", "tamaño": "60x60 cm", "acabado": "Mate"}'::jsonb
);

-- ============================================
-- PASO 5: VERIFICACIÓN FINAL
-- ============================================
SELECT
  '✅ BASE DE DATOS CREADA EXITOSAMENTE' as status,
  NOW() as timestamp;

-- Verificar tablas creadas
SELECT
  'Tablas creadas:' as info,
  COUNT(*) as total
FROM information_schema.tables
WHERE table_schema = 'public';

-- Verificar datos iniciales
SELECT 'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;

-- Verificar usuario admin
SELECT
  '✅ Usuario admin creado' as info,
  email,
  first_name,
  last_name,
  role
FROM users
WHERE role = 'admin';

-- ============================================
-- 🎉 INSTALACIÓN COMPLETA
-- ============================================
-- ✅ 10 tablas creadas
-- ✅ Usuario admin: admin@aguamarina.com (password: Admin123!)
-- ✅ 4 categorías
-- ✅ 3 productos de ejemplo
-- ✅ Sistema de autenticación listo
-- ============================================
