-- ========================================
-- Aguamarina Mosaicos - SCHEMA DATABASE
-- PostgreSQL 14+
-- ========================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto

-- ========================================
-- TIPOS ENUM
-- ========================================

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer', 'mercadopago');

-- ========================================
-- TABLA: users (Usuarios del sistema)
-- ========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ========================================
-- TABLA: categories (Categorías de productos)
-- ========================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ========================================
-- TABLA: products (Productos)
-- ========================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

    -- Precios
    price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2), -- Precio anterior para mostrar descuento
    cost_price DECIMAL(10, 2), -- Precio de costo (privado)

    -- Características del producto
    dimensions VARCHAR(100), -- Ej: "60x60 cm"
    weight DECIMAL(8, 2), -- en kg
    material VARCHAR(100),
    finish VARCHAR(100), -- Ej: "Mate", "Brillante"
    color VARCHAR(50),

    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    keywords TEXT,

    -- Control
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,

    -- Métricas
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

-- ========================================
-- TABLA: product_images (Imágenes de productos)
-- ========================================

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(is_primary);

-- ========================================
-- TABLA: customers (Información extendida de clientes)
-- ========================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200),
    tax_id VARCHAR(50), -- CUIT/CUIL
    birth_date DATE,
    notes TEXT,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_user ON customers(user_id);

-- ========================================
-- TABLA: addresses (Direcciones de envío)
-- ========================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50), -- Ej: "Casa", "Trabajo"
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    street_number VARCHAR(20) NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Argentina',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(is_default);

-- ========================================
-- TABLA: orders (Pedidos)
-- ========================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Estado
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,

    -- Totales
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,

    -- Información de envío
    shipping_first_name VARCHAR(100),
    shipping_last_name VARCHAR(100),
    shipping_phone VARCHAR(20),
    shipping_street_address VARCHAR(255),
    shipping_street_number VARCHAR(20),
    shipping_apartment VARCHAR(50),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),

    -- Notas
    customer_notes TEXT,
    admin_notes TEXT,

    -- Tracking
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ========================================
-- TABLA: order_items (Items de pedidos)
-- ========================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,

    -- Datos del producto al momento de la compra
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50),
    product_image_url VARCHAR(500),

    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ========================================
-- TABLA: inventory_movements (Movimientos de inventario)
-- ========================================

CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'order', 'return', 'manual'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_created ON inventory_movements(created_at DESC);

-- ========================================
-- TABLA: audit_logs (Auditoría)
-- ========================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
    entity_type VARCHAR(50) NOT NULL, -- 'product', 'order', 'user', etc.
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ========================================
-- TABLA: refresh_tokens (Tokens de refresco JWT)
-- ========================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(revoked_at);

-- ========================================
-- FUNCIONES Y TRIGGERS
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar stock del producto
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'in' THEN
            UPDATE products SET stock_quantity = stock_quantity + NEW.quantity WHERE id = NEW.product_id;
        ELSIF NEW.type = 'out' THEN
            UPDATE products SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.product_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_product_stock
    AFTER INSERT ON inventory_movements
    FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- Función para generar número de orden automático
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE order_number_seq;

CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista de productos con información de categoría
CREATE VIEW products_with_category AS
SELECT
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Vista de estadísticas de productos
CREATE VIEW product_stats AS
SELECT
    p.id,
    p.name,
    p.sku,
    p.stock_quantity,
    p.sales_count,
    p.views_count,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id;

-- ========================================
-- DATOS INICIALES (SEEDS)
-- ========================================

-- Usuario admin por defecto (password: Admin123!)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified)
VALUES ('admin@aguamarina.com', '$2a$10$YourHashedPasswordHere', 'admin', 'Admin', 'aguamarina', true, true);

-- Categorías iniciales
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Pisos', 'pisos', 'Cerámicos para pisos de alta calidad', 1, true),
('Revestimientos', 'revestimientos', 'Revestimientos cerámicos para paredes', 2, true),
('Porcellanatos', 'porcellanatos', 'Porcellanatos de primera calidad', 3, true),
('Sanitarios', 'sanitarios', 'Sanitarios y accesorios para baño', 4, true);

COMMENT ON DATABASE aguamarina_mosaicos IS 'Base de datos para tienda Aguamarina Mosaicos - Sistema de gestión completo';
