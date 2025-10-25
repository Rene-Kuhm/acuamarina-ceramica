-- ===============================================
-- MIGRACIÓN: Tabla de Newsletter Subscribers
-- Descripción: Crea la tabla para suscriptores del newsletter
-- Fecha: 2025-01-25
-- ===============================================

-- Crear tabla de suscriptores del newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_verified ON newsletter_subscribers(verified);

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Agregar comentarios
COMMENT ON TABLE newsletter_subscribers IS 'Suscriptores del newsletter';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email del suscriptor';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Estado de la suscripción (active/unsubscribed)';
COMMENT ON COLUMN newsletter_subscribers.verified IS 'Si el email ha sido verificado';

-- Verificar que la tabla se creó correctamente
SELECT 'Newsletter table created successfully!' as message;
SELECT COUNT(*) as initial_count FROM newsletter_subscribers;
