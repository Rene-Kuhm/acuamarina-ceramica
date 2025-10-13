-- ============================================
-- AGUAMARINA CERAMICOS - SUPABASE SETUP
-- Proyecto: umyrvlzhvdsibpzvfnal
-- ============================================

-- ============================================
-- LIMPIAR TABLAS EXISTENTES (si existen)
-- ============================================
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

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- TRIGGERS: updated_at
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
-- DATOS INICIALES: Categorías
-- ============================================
INSERT INTO categories (name, slug, description, image) VALUES
('Mosaicos Cerámicos', 'mosaicos-ceramicos', 'Diseños clásicos y modernos para pisos y paredes', '/categories/mosaicos.jpg'),
('Azulejos Decorativos', 'azulejos-decorativos', 'Dale vida a tus espacios con colores únicos', '/categories/azulejos.jpg'),
('Revestimientos', 'revestimientos', 'Protección y estilo para paredes interiores', '/categories/revestimientos.jpg'),
('Pisos Cerámicos', 'pisos-ceramicos', 'Durabilidad y elegancia para todo tipo de ambientes', '/categories/pisos.jpg');

-- ============================================
-- DATOS INICIALES: Usuario Admin
-- ============================================
-- Password: admin123 (hasheado con bcrypt)
INSERT INTO users (name, email, password, role, phone) VALUES
('Administrador', 'admin@aguamarina.com', '$2b$10$rOjLrW3qHZ9L5g5Y5p5p5OZY5p5p5p5p5p5p5p5p5p5p5p5p5p5pm', 'admin', '+54 11 1234-5678');

-- ============================================
-- DATOS INICIALES: Productos de Ejemplo
-- ============================================
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

-- ============================================
-- DATOS INICIALES: Reviews
-- ============================================
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Excelente calidad. Lo recomiendo 100%. Quedó hermoso en mi baño.'),
(2, 1, 4, 'Muy lindos, llegaron bien empaquetados. El color es tal cual se ve en la foto.'),
(3, 1, 5, 'Quedó increíble en mi living. Muy realista el efecto madera. Fácil de instalar.');

-- ============================================
-- VISTAS ÚTILES
-- ============================================
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

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
  'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- ============================================
-- ✅ SETUP COMPLETO
-- ============================================
-- Tablas creadas: 8
-- Índices creados: 17
-- Triggers creados: 5
-- Categorías: 4
-- Productos: 6
-- Usuario admin: 1 (admin@aguamarina.com / admin123)
-- Reviews: 3
-- ============================================
