/*
  # JFK.meme SEO Platform Schema

  ## Summary
  Creates the core tables for the JFK.meme SEO platform, enabling a full memecoin
  discovery experience with editorial content, FAQs, and category pages.

  ## New Tables

  ### memecoins
  The primary table storing all 50 seeded memecoins and any future live-ingested tokens.
  - `id` - UUID primary key
  - `name` - Full token name (e.g., "JFK Memecoin")
  - `slug` - URL-safe identifier (e.g., "jfk")
  - `ticker` - Token ticker symbol (e.g., "JFK")
  - `description` - Short 2-3 sentence description for cards and meta
  - `long_description` - Rich editorial text for coin detail pages
  - `chain` - Blockchain (e.g., "solana")
  - `launch_platform` - Where token launched (e.g., "pump.fun", "raydium")
  - `contract_address` - On-chain contract/mint address
  - Market data columns: price_usd, market_cap, volume_24h, price_change_24h
  - Boolean flags: is_featured, is_trending, is_new, is_indexed
  - `tags` - Text array for taxonomy (e.g., ["pump.fun", "politifi"])
  - `logo_url`, `banner_url` - Media assets
  - `data_source`, `external_data_id` - Reserved for live data ingestion
  - `launch_date` - Date token was launched
  - `created_at`, `updated_at` - Timestamps

  ### coin_faqs
  Admin-curated FAQ entries per coin, displayed on coin detail pages.
  - `id` - UUID primary key
  - `coin_slug` - Foreign key to memecoins.slug
  - `question` - FAQ question text
  - `answer` - FAQ answer text
  - `sort_order` - Display ordering

  ### categories
  Editorial category pages (e.g., "Solana Memecoins", "PolitiFi").
  - `id` - UUID primary key
  - `slug` - URL path (e.g., "solana-memecoins")
  - `name` - Display name
  - `description` - Long editorial content (500+ words)
  - `meta_title`, `meta_description` - SEO metadata
  - `is_active` - Whether to display the category
  - `sort_order` - Navigation ordering

  ### category_coins
  Join table linking categories to their member coins with ordering.
  - `category_slug` - References categories.slug
  - `coin_slug` - References memecoins.slug
  - `sort_order` - Display order within category

  ## Security
  - RLS enabled on all tables
  - Anon role gets SELECT only on all tables
  - No public INSERT/UPDATE/DELETE
*/

-- memecoins table
CREATE TABLE IF NOT EXISTS memecoins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  ticker text NOT NULL,
  description text DEFAULT '',
  long_description text DEFAULT '',
  chain text NOT NULL DEFAULT 'solana',
  launch_platform text DEFAULT '',
  contract_address text DEFAULT '',
  price_usd numeric DEFAULT 0,
  market_cap numeric DEFAULT 0,
  volume_24h numeric DEFAULT 0,
  price_change_24h numeric DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_indexed boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  logo_url text DEFAULT '',
  banner_url text DEFAULT '',
  data_source text DEFAULT 'manual',
  external_data_id text DEFAULT '',
  launch_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memecoins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read memecoins"
  ON memecoins FOR SELECT
  TO anon, authenticated
  USING (true);

-- coin_faqs table
CREATE TABLE IF NOT EXISTS coin_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_slug text NOT NULL REFERENCES memecoins(slug) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coin_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read coin_faqs"
  ON coin_faqs FOR SELECT
  TO anon, authenticated
  USING (true);

-- categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- category_coins join table
CREATE TABLE IF NOT EXISTS category_coins (
  category_slug text NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
  coin_slug text NOT NULL REFERENCES memecoins(slug) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  PRIMARY KEY (category_slug, coin_slug)
);

ALTER TABLE category_coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read category_coins"
  ON category_coins FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_memecoins_slug ON memecoins(slug);
CREATE INDEX IF NOT EXISTS idx_memecoins_chain ON memecoins(chain);
CREATE INDEX IF NOT EXISTS idx_memecoins_launch_platform ON memecoins(launch_platform);
CREATE INDEX IF NOT EXISTS idx_memecoins_is_featured ON memecoins(is_featured);
CREATE INDEX IF NOT EXISTS idx_memecoins_is_trending ON memecoins(is_trending);
CREATE INDEX IF NOT EXISTS idx_memecoins_is_new ON memecoins(is_new);
CREATE INDEX IF NOT EXISTS idx_memecoins_is_indexed ON memecoins(is_indexed);
CREATE INDEX IF NOT EXISTS idx_memecoins_market_cap ON memecoins(market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_memecoins_created_at ON memecoins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_faqs_coin_slug ON coin_faqs(coin_slug);
CREATE INDEX IF NOT EXISTS idx_category_coins_category_slug ON category_coins(category_slug);
