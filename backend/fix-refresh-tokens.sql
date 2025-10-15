-- Migración: Agregar campo revoked_at a refresh_tokens
-- Fecha: 2025-10-15
-- Descripción: Agrega el campo revoked_at necesario para el logout

-- Verificar si la columna ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'refresh_tokens'
        AND column_name = 'revoked_at'
    ) THEN
        -- Agregar columna revoked_at
        ALTER TABLE refresh_tokens ADD COLUMN revoked_at TIMESTAMP;

        -- Crear índice para revoked_at
        CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(revoked_at);

        RAISE NOTICE 'Columna revoked_at agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna revoked_at ya existe';
    END IF;
END $$;
