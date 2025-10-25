-- ============================================
-- ADD MERCADOPAGO FIELDS TO ORDERS TABLE
-- ============================================

-- Add mercadopago_payment_id field if it doesn't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_mercadopago_payment_id
ON orders(mercadopago_payment_id);

-- Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'mercadopago_payment_id';

SELECT '✅ Campo mercadopago_payment_id agregado correctamente' as status;
