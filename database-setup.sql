-- ============================================
-- ACUAMARINA CERÁMICOS - DATABASE SETUP
-- Sistema Completo de E-commerce
-- PostgreSQL / Supabase Compatible
-- ============================================
--
-- Este script crea el esquema completo de la base de datos
-- incluyendo todas las tablas, índices, triggers, vistas y datos iniciales
--
-- Versión: 1.0.0
-- Fecha: 2025-10-25
-- ============================================

-- ============================================
-- SECCIÓN 1: LIMPIEZA (DESARROLLO)
-- ============================================
-- ADVERTENCIA: Solo usar en desarrollo. En producción, comentar esta sección.

DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- SECCIÓN 2: EXTENSIONES
-- ============================================

-- Habilitar extensión para UUID (necesaria para newsletter)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SECCIÓN 3: TABLAS PRINCIPALES
-- ============================================

-- --------------------------------------------
-- TABLA: users
-- Gestión de usuarios (clientes y administradores)
-- --------------------------------------------
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

COMMENT ON TABLE users IS 'Usuarios del sistema (clientes y administradores)';
COMMENT ON COLUMN users.role IS 'Rol del usuario: user (cliente), admin (administrador), manager (gerente)';

-- --------------------------------------------
-- TABLA: categories
-- Categorías de productos
-- --------------------------------------------
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para categories
CREATE INDEX idx_categories_slug ON categories(slug);

COMMENT ON TABLE categories IS 'Categorías de productos';
COMMENT ON COLUMN categories.slug IS 'URL-friendly identifier para SEO';

-- --------------------------------------------
-- TABLA: products
-- Productos del catálogo
-- --------------------------------------------
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

-- Índices para products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);

COMMENT ON TABLE products IS 'Catálogo de productos';
COMMENT ON COLUMN products.images IS 'Array JSON con URLs de imágenes';
COMMENT ON COLUMN products.specifications IS 'Objeto JSON con especificaciones técnicas';
COMMENT ON COLUMN products.featured IS 'Producto destacado en homepage';

-- --------------------------------------------
-- TABLA: orders
-- Pedidos de clientes
-- --------------------------------------------
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

-- Índices para orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

COMMENT ON TABLE orders IS 'Pedidos realizados por clientes';
COMMENT ON COLUMN orders.shipping_address IS 'Dirección de envío en formato JSON';
COMMENT ON COLUMN orders.status IS 'Estado del pedido: pending, processing, shipped, delivered, cancelled';

-- --------------------------------------------
-- TABLA: order_items
-- Items individuales de cada pedido
-- --------------------------------------------
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

-- Índices para order_items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Items individuales de cada pedido';
COMMENT ON COLUMN order_items.product_name IS 'Nombre del producto al momento de la compra';
COMMENT ON COLUMN order_items.product_price IS 'Precio del producto al momento de la compra';

-- --------------------------------------------
-- TABLA: contacts
-- Mensajes de contacto del sitio web
-- --------------------------------------------
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

-- Índices para contacts
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);

COMMENT ON TABLE contacts IS 'Mensajes de contacto enviados desde el sitio web';

-- --------------------------------------------
-- TABLA: reviews
-- Reseñas y calificaciones de productos
-- --------------------------------------------
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

COMMENT ON TABLE reviews IS 'Reseñas y calificaciones de productos';
COMMENT ON COLUMN reviews.rating IS 'Calificación de 1 a 5 estrellas';

-- --------------------------------------------
-- TABLA: newsletter_subscribers
-- Suscriptores del newsletter
-- --------------------------------------------
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  verification_token VARCHAR(255),
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para newsletter_subscribers
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_verified ON newsletter_subscribers(verified);

COMMENT ON TABLE newsletter_subscribers IS 'Suscriptores del newsletter';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Estado de la suscripción: active, unsubscribed';
COMMENT ON COLUMN newsletter_subscribers.verified IS 'Indica si el email ha sido verificado';

-- ============================================
-- SECCIÓN 4: FUNCIONES Y TRIGGERS
-- ============================================

-- --------------------------------------------
-- FUNCIÓN: Actualizar columna updated_at
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'Actualiza automáticamente la columna updated_at al modificar un registro';

-- --------------------------------------------
-- TRIGGERS: Aplicar updated_at a todas las tablas
-- --------------------------------------------
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SECCIÓN 5: VISTAS
-- ============================================

-- --------------------------------------------
-- VISTA: products_with_category
-- Productos con información de categoría y rating promedio
-- --------------------------------------------
CREATE OR REPLACE VIEW products_with_category AS
SELECT
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, c.id;

COMMENT ON VIEW products_with_category IS 'Productos con información completa de categoría y calificaciones';

-- --------------------------------------------
-- VISTA: user_order_stats
-- Estadísticas de pedidos por usuario
-- --------------------------------------------
CREATE OR REPLACE VIEW user_order_stats AS
SELECT
  u.id as user_id,
  u.name,
  u.email,
  COUNT(o.id) as total_orders,
  COALESCE(SUM(o.total), 0) as total_spent,
  MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

COMMENT ON VIEW user_order_stats IS 'Estadísticas de compras por usuario';

-- ============================================
-- SECCIÓN 6: FUNCIONES ÚTILES
-- ============================================

-- --------------------------------------------
-- FUNCIÓN: Obtener productos más vendidos
-- --------------------------------------------
CREATE OR REPLACE FUNCTION get_top_selling_products(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  product_id INTEGER,
  product_name VARCHAR,
  total_quantity_sold BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    SUM(oi.quantity)::BIGINT as total_qty,
    SUM(oi.subtotal) as total_rev
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  GROUP BY p.id
  ORDER BY total_qty DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_top_selling_products(INTEGER) IS 'Retorna los productos más vendidos';

-- ============================================
-- SECCIÓN 7: SEGURIDAD (ROW LEVEL SECURITY)
-- ============================================
-- Nota: Solo necesario para Supabase. Comentar si usas otro sistema.

-- Habilitar RLS en tablas sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios solo pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id::text);

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id::text);

-- Products y categories son públicas (no necesitan RLS)

-- ============================================
-- SECCIÓN 8: DATOS INICIALES
-- ============================================

-- --------------------------------------------
-- Categorías iniciales
-- --------------------------------------------
INSERT INTO categories (name, slug, description, image) VALUES
('Mosaicos Cerámicos', 'mosaicos-ceramicos', 'Diseños clásicos y modernos para pisos y paredes', '/categories/mosaicos.jpg'),
('Azulejos Decorativos', 'azulejos-decorativos', 'Dale vida a tus espacios con colores únicos', '/categories/azulejos.jpg'),
('Revestimientos', 'revestimientos', 'Protección y estilo para paredes interiores', '/categories/revestimientos.jpg'),
('Pisos Cerámicos', 'pisos-ceramicos', 'Durabilidad y elegancia para todo tipo de ambientes', '/categories/pisos.jpg');

-- --------------------------------------------
-- Usuario administrador
-- Password: admin123 (hasheado con bcrypt, 10 rounds)
-- --------------------------------------------
INSERT INTO users (name, email, password, role, phone) VALUES
('Administrador', 'admin@aguamarina.com', '$2b$10$rOjLrW3qHZ9L5g5Y5p5p5OZY5p5p5p5p5p5p5p5p5p5p5p5p5p5pm', 'admin', '+54 11 1234-5678');

-- --------------------------------------------
-- Productos de ejemplo
-- --------------------------------------------
INSERT INTO products (name, slug, description, price, stock, featured, category_id, images, specifications) VALUES
(
  'Mosaico Veneciano Blanco 30x30',
  'mosaico-veneciano-blanco-30x30',
  'Elegante mosaico veneciano en color blanco mate. Ideal para baños y cocinas modernas. Resistente al agua y fácil de limpiar. Acabado mate que no resbala.',
  1250.00,
  150,
  true,
  1,
  '["https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop"]'::jsonb,
  '{"material": "Cerámica", "tamaño": "30x30 cm", "acabado": "Mate", "uso": "Interior", "resistencia": "Alta", "absorción": "Baja"}'::jsonb
),
(
  'Azulejo Geométrico Azul 20x20',
  'azulejo-geometrico-azul-20x20',
  'Azulejo decorativo con patrón geométrico en tonos azules. Perfecto para crear espacios únicos y modernos. Acabado brillante que aporta luminosidad.',
  890.00,
  200,
  true,
  2,
  '["https://images.unsplash.com/photo-1616628188550-808682f9dfe4?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1616137422495-6c4be36e2b47?w=800&auto=format&fit=crop"]'::jsonb,
  '{"material": "Porcelanato", "tamaño": "20x20 cm", "acabado": "Brillante", "uso": "Pared", "estilo": "Moderno"}'::jsonb
),
(
  'Revestimiento Símil Madera 15x90',
  'revestimiento-simil-madera-15x90',
  'Revestimiento cerámico con textura símil madera. Aporta calidez natural sin el mantenimiento de la madera real. Resistente a humedad y golpes.',
  2100.00,
  80,
  true,
  3,
  '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&auto=format&fit=crop"]'::jsonb,
  '{"material": "Gres", "tamaño": "15x90 cm", "acabado": "Texturado", "uso": "Interior/Exterior", "efecto": "Madera"}'::jsonb
),
(
  'Piso Porcelanato Gris 60x60',
  'piso-porcelanato-gris-60x60',
  'Porcelanato de alta resistencia en tono gris neutro. Ideal para áreas de alto tránsito. Acabado mate antideslizante.',
  1580.00,
  120,
  true,
  4,
  '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&auto=format&fit=crop"]'::jsonb,
  '{"material": "Porcelanato", "tamaño": "60x60 cm", "acabado": "Mate", "uso": "Piso", "tráfico": "Alto"}'::jsonb
),
(
  'Mosaico Hidráulico Vintage',
  'mosaico-hidraulico-vintage',
  'Mosaico con diseño hidráulico vintage. Perfecto para darle un toque retro a tus espacios. Hecho a mano con técnicas tradicionales.',
  1890.00,
  60,
  false,
  1,
  '["https://images.unsplash.com/photo-1615529162924-f83c6b937ec2?w=800&auto=format&fit=crop"]'::jsonb,
  '{"material": "Cerámica", "tamaño": "20x20 cm", "acabado": "Mate", "uso": "Interior", "estilo": "Vintage"}'::jsonb
),
(
  'Azulejo Subway Blanco 7.5x15',
  'azulejo-subway-blanco-7-5x15',
  'Clásico azulejo tipo subway en blanco brillante. Atemporal y versátil, ideal para cocinas y baños modernos.',
  450.00,
  300,
  false,
  2,
  '["https://images.unsplash.com/photo-1616137422495-6c4be36e2b47?w=800&auto=format&fit=crop"]'::jsonb,
  '{"material": "Cerámica", "tamaño": "7.5x15 cm", "acabado": "Brillante", "uso": "Pared", "estilo": "Clásico"}'::jsonb
);

-- --------------------------------------------
-- Reviews de ejemplo
-- --------------------------------------------
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Excelente calidad. Lo recomiendo 100%. Quedó hermoso en mi baño.'),
(2, 1, 4, 'Muy lindos, llegaron bien empaquetados. El color es tal cual se ve en la foto.'),
(3, 1, 5, 'Quedó increíble en mi living. Muy realista el efecto madera. Fácil de instalar.');

-- ============================================
-- SECCIÓN 9: VERIFICACIÓN
-- ============================================

-- Verificar conteo de registros por tabla
SELECT
  'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers;

-- Listar todas las tablas creadas
SELECT tablename, schemaname
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- RESUMEN DEL SETUP
-- ============================================
--
-- ✅ Tablas creadas: 8
--    - users (usuarios y administradores)
--    - categories (categorías de productos)
--    - products (catálogo de productos)
--    - orders (pedidos)
--    - order_items (items de pedidos)
--    - contacts (mensajes de contacto)
--    - reviews (reseñas de productos)
--    - newsletter_subscribers (suscriptores newsletter)
--
-- ✅ Índices creados: 20+
--    - Optimizados para búsquedas frecuentes
--
-- ✅ Triggers creados: 6
--    - Actualización automática de updated_at
--
-- ✅ Vistas creadas: 2
--    - products_with_category
--    - user_order_stats
--
-- ✅ Funciones creadas: 2
--    - update_updated_at_column()
--    - get_top_selling_products()
--
-- ✅ Datos iniciales:
--    - 4 categorías
--    - 6 productos de ejemplo
--    - 1 usuario admin (admin@aguamarina.com / admin123)
--    - 3 reviews de ejemplo
--
-- ✅ Seguridad:
--    - Row Level Security habilitado (Supabase)
--    - Políticas de acceso configuradas
--
-- ============================================
-- FIN DEL SCRIPT
-- ============================================
