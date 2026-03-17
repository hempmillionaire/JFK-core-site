/*
  # Extend Memecoins Schema for Live Data Ingestion

  ## Summary
  Adds new columns to the memecoins table to support automated market data ingestion
  from DexScreener and Birdeye. Also adds supporting tables for historical market
  snapshots and ingestion job tracking. Enforces slug uniqueness (already present as
  UNIQUE column constraint) and adds a unique partial index on contract_address for
  safe upsert deduplication. Deduplicates any existing rows sharing the same
  contract_address before adding the index.

  ## Modified Tables

  ### memecoins (new columns)
  - `liquidity_usd` - Current liquidity in USD from DexScreener
  - `fdv` - Fully diluted valuation
  - `pair_created_at` - When the trading pair was first created on-chain
  - `trending_score` - Computed score used for trending sort order
  - `dexscreener_pair_id` - Internal DexScreener pair identifier
  - `dexscreener_pair_url` - Direct URL to the DexScreener pair page
  - `birdeye_url` - Direct URL to the Birdeye token page
  - `dextools_url` - DEXTools URL (only stored when explicitly known, never generated)
  - `image_url` - Token logo/image URL from external sources
  - `website_url` - Project website URL
  - `x_url` - Project Twitter/X profile URL
  - `telegram_url` - Project Telegram group URL

  ## New Tables

  ### coin_market_log
  Time-series snapshots of market data per coin, written by ingestion jobs.

  ### ingestion_jobs
  Tracks each run of an ingestion job for monitoring and debugging.

  ## Security
  - RLS enabled on new tables
  - Anon role gets SELECT only

  ## Notes
  1. Duplicate contract_address rows are resolved before adding the unique index by
     nulling out the address on the later-created duplicate (keeps the first inserted).
  2. The unique index is a partial index excluding empty strings so seeded rows with
     no contract address don't conflict.
*/

-- Add new columns to memecoins
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'liquidity_usd') THEN
    ALTER TABLE memecoins ADD COLUMN liquidity_usd numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'fdv') THEN
    ALTER TABLE memecoins ADD COLUMN fdv numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'pair_created_at') THEN
    ALTER TABLE memecoins ADD COLUMN pair_created_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'trending_score') THEN
    ALTER TABLE memecoins ADD COLUMN trending_score numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'dexscreener_pair_id') THEN
    ALTER TABLE memecoins ADD COLUMN dexscreener_pair_id text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'dexscreener_pair_url') THEN
    ALTER TABLE memecoins ADD COLUMN dexscreener_pair_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'birdeye_url') THEN
    ALTER TABLE memecoins ADD COLUMN birdeye_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'dextools_url') THEN
    ALTER TABLE memecoins ADD COLUMN dextools_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'image_url') THEN
    ALTER TABLE memecoins ADD COLUMN image_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'website_url') THEN
    ALTER TABLE memecoins ADD COLUMN website_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'x_url') THEN
    ALTER TABLE memecoins ADD COLUMN x_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memecoins' AND column_name = 'telegram_url') THEN
    ALTER TABLE memecoins ADD COLUMN telegram_url text DEFAULT '';
  END IF;
END $$;

-- Resolve duplicate contract_address rows before adding unique index.
-- For each duplicate group, keep the earliest-created row's address intact
-- and clear the address on any later duplicates.
DO $$
DECLARE
  dup RECORD;
  keep_id uuid;
BEGIN
  FOR dup IN
    SELECT contract_address
    FROM memecoins
    WHERE contract_address IS NOT NULL AND contract_address <> ''
    GROUP BY contract_address
    HAVING COUNT(*) > 1
  LOOP
    SELECT id INTO keep_id
    FROM memecoins
    WHERE contract_address = dup.contract_address
    ORDER BY created_at ASC
    LIMIT 1;

    UPDATE memecoins
    SET contract_address = ''
    WHERE contract_address = dup.contract_address
      AND id <> keep_id;
  END LOOP;
END $$;

-- Unique partial index on contract_address (non-empty only) for safe upsert deduplication
CREATE UNIQUE INDEX IF NOT EXISTS idx_memecoins_contract_address_unique
  ON memecoins(contract_address)
  WHERE contract_address IS NOT NULL AND contract_address <> '';

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_memecoins_trending_score ON memecoins(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_memecoins_pair_created_at ON memecoins(pair_created_at DESC);

-- coin_market_log table
CREATE TABLE IF NOT EXISTS coin_market_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_slug text NOT NULL REFERENCES memecoins(slug) ON DELETE CASCADE,
  price_usd numeric DEFAULT 0,
  market_cap numeric DEFAULT 0,
  volume_24h numeric DEFAULT 0,
  price_change_24h numeric DEFAULT 0,
  liquidity_usd numeric DEFAULT 0,
  fdv numeric DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE coin_market_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read coin_market_log"
  ON coin_market_log FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_coin_market_log_slug_time ON coin_market_log(coin_slug, recorded_at DESC);

-- ingestion_jobs table
CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  coins_processed integer DEFAULT 0,
  coins_updated integer DEFAULT 0,
  errors jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'running'
);

ALTER TABLE ingestion_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ingestion_jobs"
  ON ingestion_jobs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_source_time ON ingestion_jobs(source, started_at DESC);
