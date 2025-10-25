-- ============================================
-- MIGRATE ORDERS TABLE FOR PUBLIC ORDERS
-- ============================================
-- This migration adds fields needed for public order creation
-- without user authentication

-- Add missing columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_number VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Add price column to order_items (in addition to product_price)
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Copy existing product_price to price for backward compatibility
UPDATE order_items
SET price = product_price
WHERE price IS NULL;

-- Verify the changes
SELECT '✅ Migration completed successfully' as status;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
