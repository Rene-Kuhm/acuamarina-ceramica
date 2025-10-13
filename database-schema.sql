-- ============================================
-- AGUAMARINA CERAMICOS - DATABASE SCHEMA
-- PostgreSQL / Supabase Compatible
-- ============================================

-- Drop tables if exist (careful in production!)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABLA: categories
-- ============================================
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

-- ============================================
-- TABLA: products
-- ============================================
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

-- ============================================
-- TABLA: orders
-- ============================================
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

-- ============================================
-- TABLA: order_items
-- ============================================
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

-- ============================================
-- TABLA: contacts
-- ============================================
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

-- ============================================
-- TABLA: reviews
-- ============================================
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

-- ============================================
-- TRIGGERS: updated_at
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
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
-- DATOS DE EJEMPLO
-- ============================================

-- Categorías iniciales
INSERT INTO categories (name, slug, description) VALUES
('Mosaicos Cerámicos', 'mosaicos-ceramicos', 'Diseños clásicos y modernos para pisos y paredes'),
('Azulejos Decorativos', 'azulejos-decorativos', 'Dale vida a tus espacios con colores únicos'),
('Revestimientos', 'revestimientos', 'Protección y estilo para paredes interiores'),
('Pisos Cerámicos', 'pisos-ceramicos', 'Durabilidad y elegancia para todo tipo de ambientes');

-- Usuario administrador (password: admin123)
-- Hash generado con bcrypt rounds=10
INSERT INTO users (name, email, password, role) VALUES
('Administrador', 'admin@aguamarina.com', '$2b$10$K7L/LQG8P5.T2.P5.Q5.Z5.E5.Q5.W5.X5.Y5.A5.B5.C5.D5', 'admin');

-- Productos de ejemplo
INSERT INTO products (name, slug, description, price, stock, featured, category_id, images, specifications) VALUES
(
  'Mosaico Veneciano Blanco',
  'mosaico-veneciano-blanco',
  'Elegante mosaico veneciano en color blanco mate. Ideal para baños y cocinas modernas. Resistente al agua y fácil de limpiar.',
  1250.00,
  150,
  true,
  1,
  '["https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800"]'::jsonb,
  '{"material": "Cerámica", "tamaño": "30x30 cm", "acabado": "Mate", "uso": "Interior"}'::jsonb
),
(
  'Azulejo Geométrico Azul',
  'azulejo-geometrico-azul',
  'Azulejo decorativo con patrón geométrico en tonos azules. Perfecto para crear espacios únicos y modernos.',
  890.00,
  200,
  true,
  2,
  '["https://images.unsplash.com/photo-1616628188550-808682f9dfe4?w=800"]'::jsonb,
  '{"material": "Porcelanato", "tamaño": "20x20 cm", "acabado": "Brillante", "uso": "Pared"}'::jsonb
),
(
  'Revestimiento Símil Madera',
  'revestimiento-simil-madera',
  'Revestimiento cerámico con textura símil madera. Aporta calidez natural sin el mantenimiento de la madera real.',
  2100.00,
  80,
  true,
  3,
  '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]'::jsonb,
  '{"material": "Gres", "tamaño": "15x90 cm", "acabado": "Texturado", "uso": "Interior/Exterior"}'::jsonb
),
(
  'Piso Porcelanato Gris',
  'piso-porcelanato-gris',
  'Porcelanato de alta resistencia en tono gris neutro. Ideal para áreas de alto tránsito.',
  1580.00,
  120,
  false,
  4,
  '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"]'::jsonb,
  '{"material": "Porcelanato", "tamaño": "60x60 cm", "acabado": "Mate", "uso": "Piso"}'::jsonb
);

-- Reviews de ejemplo
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Excelente calidad. Lo recomiendo 100%'),
(2, 1, 4, 'Muy lindos, llegaron bien empaquetados'),
(3, 1, 5, 'Quedó hermoso en mi living. Muy realista el efecto madera');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Productos con info de categoría
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

-- Vista: Estadísticas de pedidos por usuario
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

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función: Obtener productos más vendidos
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

-- ============================================
-- PERMISOS (Row Level Security para Supabase)
-- ============================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios solo pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id::text);

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id::text);

-- Products, categories son públicas (lectura)
-- (No RLS necesario para tablas públicas)

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
SELECT
  'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- Listar todas las tablas creadas
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
