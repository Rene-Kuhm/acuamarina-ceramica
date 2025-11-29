-- Schema Export from Supabase
-- Generated: 2025-11-29T19:34:48.637Z

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Table: audit_logs
DROP TABLE IF EXISTS audit_logs CASCADE;
CREATE TABLE audit_logs (id integer NOT NULL, user_id integer, action character varying(50) NOT NULL, entity_type character varying(50) NOT NULL, entity_id character varying(100) NOT NULL, old_values jsonb, new_values jsonb, ip_address character varying(45), user_agent text, created_at timestamp without time zone);

-- Table: categories
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (id integer NOT NULL, name character varying(255) NOT NULL, slug character varying(255) NOT NULL, description text, image character varying(500), created_at timestamp without time zone, updated_at timestamp without time zone, parent_id integer, is_active boolean, display_order integer, meta_title character varying(255), meta_description text);

-- Table: contacts
DROP TABLE IF EXISTS contacts CASCADE;
CREATE TABLE contacts (id integer NOT NULL, name character varying(255) NOT NULL, email character varying(255) NOT NULL, phone character varying(50), subject character varying(255) NOT NULL, message text NOT NULL, status character varying(50), created_at timestamp without time zone);

-- Table: customers
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (id integer NOT NULL, user_id integer, first_name character varying(100) NOT NULL, last_name character varying(100) NOT NULL, email character varying(255) NOT NULL, phone character varying(50), address jsonb, is_active boolean, notes text, created_at timestamp without time zone, updated_at timestamp without time zone);

-- Table: newsletter_subscribers
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
CREATE TABLE newsletter_subscribers (id uuid NOT NULL, email character varying(255) NOT NULL, name character varying(255), status character varying(20), subscribed_at timestamp without time zone, unsubscribed_at timestamp without time zone, verification_token character varying(255), verified boolean, verified_at timestamp without time zone, created_at timestamp without time zone, updated_at timestamp without time zone);

-- Table: order_items
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (id integer NOT NULL, order_id integer, product_id integer, product_name character varying(255) NOT NULL, product_price numeric(10,2) NOT NULL, quantity integer NOT NULL, subtotal numeric(10,2) NOT NULL, created_at timestamp without time zone, price numeric(10,2));

-- Table: orders
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (id integer NOT NULL, user_id integer, status character varying(50), total numeric(10,2) NOT NULL, shipping_address jsonb NOT NULL, payment_method character varying(100), notes text, created_at timestamp without time zone, updated_at timestamp without time zone, mercadopago_payment_id character varying(255), order_number character varying(255), customer_name character varying(255), customer_email character varying(255), customer_phone character varying(50), total_amount numeric(10,2), payment_status character varying(50), shipped_at timestamp without time zone, delivered_at timestamp without time zone);

-- Table: product_images
DROP TABLE IF EXISTS product_images CASCADE;
CREATE TABLE product_images (id integer NOT NULL, product_id integer NOT NULL, url character varying(500) NOT NULL, alt_text character varying(255), is_primary boolean, display_order integer, created_at timestamp without time zone, updated_at timestamp without time zone);

-- Table: products
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (id integer NOT NULL, name character varying(255) NOT NULL, slug character varying(255) NOT NULL, description text NOT NULL, price numeric(10,2) NOT NULL, stock integer, images jsonb, specifications jsonb, featured boolean, category_id integer, created_at timestamp without time zone, updated_at timestamp without time zone, is_active boolean, sku character varying(100), weight numeric(10,2), dimensions jsonb, discount_price numeric(10,2), tags jsonb, meta_title character varying(255), meta_description text, image_url character varying(500), short_description text, compare_price numeric(10,2), cost_price numeric(10,2), material character varying(100), finish character varying(100), color character varying(50), stock_quantity integer, low_stock_threshold integer, is_featured boolean, keywords text);

-- Table: refresh_tokens
DROP TABLE IF EXISTS refresh_tokens CASCADE;
CREATE TABLE refresh_tokens (id integer NOT NULL, user_id integer NOT NULL, token character varying(500) NOT NULL, expires_at timestamp without time zone NOT NULL, revoked_at timestamp without time zone, created_at timestamp without time zone);

-- Table: reviews
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (id integer NOT NULL, product_id integer, user_id integer, rating integer NOT NULL, comment text, created_at timestamp without time zone, updated_at timestamp without time zone, title character varying(100), verified_purchase boolean);

-- Table: users
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (id integer NOT NULL, email character varying(255) NOT NULL, password character varying(255) NOT NULL, phone character varying(50), role character varying(50), created_at timestamp without time zone, updated_at timestamp without time zone, name character varying(255));

