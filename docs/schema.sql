-- ============================================================
-- FLEX COMPUTERS — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- CATEGORIES
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────────────
CREATE TYPE stock_status_enum AS ENUM ('in_stock', 'out_of_stock', 'pre_order');

CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  brand          TEXT NOT NULL,
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  price          NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(10,2) CHECK (discount_price >= 0),
  cpu            TEXT,
  gpu            TEXT,
  ram            TEXT,
  storage        TEXT,
  screen_size    TEXT,
  description    TEXT,
  images         TEXT[] NOT NULL DEFAULT '{}',
  stock_status   stock_status_enum NOT NULL DEFAULT 'in_stock',
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  tags           TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS products_brand_idx       ON products(brand);
CREATE INDEX IF NOT EXISTS products_featured_idx    ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS products_stock_idx       ON products(stock_status);
CREATE INDEX IF NOT EXISTS products_category_idx    ON products(category_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx  ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_price_idx       ON products(price);

-- Full-text search index
CREATE INDEX IF NOT EXISTS products_fts_idx ON products
  USING gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(description,'')));

-- ──────────────────────────────────────────────
-- AUTO-UPDATE updated_at trigger
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────

-- Enable RLS
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read products"
  ON products FOR SELECT USING (TRUE);

CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (TRUE);

-- Only authenticated users (admins) can write
CREATE POLICY "Auth write products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth write categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- STORAGE BUCKET
-- Run separately after creating bucket "product-images" in Storage UI
-- ──────────────────────────────────────────────

-- Allow public read access to product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Auth upload product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- SEED DATA — Sample categories
-- ──────────────────────────────────────────────
INSERT INTO categories (name, slug, description) VALUES
  ('Laptops',           'laptops',           'All laptop computers'),
  ('Gaming Laptops',    'gaming-laptops',    'High-performance gaming laptops'),
  ('Business Laptops',  'business-laptops',  'Professional business laptops'),
  ('Ultrabooks',        'ultrabooks',        'Thin and light ultrabooks'),
  ('Accessories',       'accessories',       'Laptop accessories and peripherals')
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────
-- SEED DATA — Sample products (adjust UUIDs as needed)
-- ──────────────────────────────────────────────
INSERT INTO products (name, slug, brand, price, discount_price, cpu, gpu, ram, storage, screen_size, description, images, stock_status, is_featured, tags) VALUES
(
  'Dell XPS 15 9530',
  'dell-xps-15-9530',
  'Dell',
  1899.00,
  1699.00,
  'Intel Core i7-13700H',
  'NVIDIA GeForce RTX 4060',
  '16GB DDR5',
  '512GB NVMe SSD',
  '15.6',
  'The Dell XPS 15 combines stunning OLED display technology with powerful internals for creators and professionals.',
  '{}',
  'in_stock',
  TRUE,
  ARRAY['creator', 'oled', 'thin-bezel']
),
(
  'Apple MacBook Pro 14" M3',
  'apple-macbook-pro-14-m3',
  'Apple',
  2199.00,
  NULL,
  'Apple M3 Pro',
  'Apple M3 Pro GPU (18-core)',
  '18GB Unified Memory',
  '512GB SSD',
  '14.2',
  'The MacBook Pro with M3 Pro chip delivers exceptional performance for professionals with incredible battery life.',
  '{}',
  'in_stock',
  TRUE,
  ARRAY['apple-silicon', 'macos', 'professional']
),
(
  'ASUS ROG Strix G16',
  'asus-rog-strix-g16',
  'ASUS',
  1499.00,
  1349.00,
  'Intel Core i9-13980HX',
  'NVIDIA GeForce RTX 4070',
  '32GB DDR5',
  '1TB NVMe SSD',
  '16',
  'Dominate every game with the ROG Strix G16. Featuring a 240Hz display and top-tier RTX 4070 graphics.',
  '{}',
  'in_stock',
  TRUE,
  ARRAY['gaming', 'high-refresh', 'rgb']
),
(
  'Lenovo ThinkPad X1 Carbon Gen 11',
  'lenovo-thinkpad-x1-carbon-gen-11',
  'Lenovo',
  1599.00,
  1449.00,
  'Intel Core i7-1365U',
  'Intel Iris Xe Graphics',
  '16GB LPDDR5',
  '512GB SSD',
  '14',
  'The ultimate business ultrabook. Featherlight at 1.12 kg with enterprise-grade security and all-day battery.',
  '{}',
  'in_stock',
  FALSE,
  ARRAY['business', 'ultralight', 'thinkpad']
),
(
  'HP Spectre x360 14',
  'hp-spectre-x360-14',
  'HP',
  1399.00,
  NULL,
  'Intel Core i7-1355U',
  'Intel Iris Xe Graphics',
  '16GB LPDDR4x',
  '1TB SSD',
  '13.5',
  '2-in-1 convertible with OLED touch display. Versatile design for work and entertainment.',
  '{}',
  'in_stock',
  TRUE,
  ARRAY['2-in-1', 'convertible', 'touch']
),
(
  'MSI Titan GT77 HX',
  'msi-titan-gt77-hx',
  'MSI',
  3299.00,
  2999.00,
  'Intel Core i9-13980HX',
  'NVIDIA GeForce RTX 4090',
  '64GB DDR5',
  '2TB NVMe SSD',
  '17.3',
  'The most powerful laptop MSI has ever made. Desktop-class RTX 4090 performance in a laptop form factor.',
  '{}',
  'in_stock',
  TRUE,
  ARRAY['flagship', 'gaming', '4k-display']
),
(
  'Acer Swift 3 SF314',
  'acer-swift-3-sf314',
  'Acer',
  699.00,
  599.00,
  'AMD Ryzen 5 7530U',
  'AMD Radeon Graphics',
  '8GB LPDDR4x',
  '256GB SSD',
  '14',
  'Perfect for students and everyday users. Lightweight aluminum design with great battery life.',
  '{}',
  'in_stock',
  FALSE,
  ARRAY['student', 'budget', 'amd']
),
(
  'Samsung Galaxy Book3 Pro',
  'samsung-galaxy-book3-pro',
  'Samsung',
  1299.00,
  1099.00,
  'Intel Core i7-1360P',
  'Intel Iris Xe Graphics',
  '16GB LPDDR5',
  '512GB NVMe SSD',
  '16',
  'Ultra-thin premium laptop with a stunning AMOLED display and seamless Galaxy ecosystem integration.',
  '{}',
  'in_stock',
  FALSE,
  ARRAY['amoled', 'galaxy', 'premium']
)
ON CONFLICT (slug) DO NOTHING;
