# Live Data Ingestion Architecture

## Overview

This directory defines the ingestion contract for live data pipelines that write to the `memecoins` table.
Any process that conforms to this contract will automatically surface on all routes with zero code changes.

## Ingestion Contract

Any data source (Supabase Edge Function, cron job, external API bridge) must write records conforming
to the `IngestRecord` interface defined in `types.ts` into the `memecoins` table.

### Key Columns for Ingestion

| Column | Type | Notes |
|--------|------|-------|
| `slug` | text | Primary identifier — must be unique and URL-safe |
| `data_source` | text | Identifies the ingestion source (e.g., `dexscreener`, `coingecko`, `manual`) |
| `external_data_id` | text | The token ID in the external data source (e.g., CoinGecko token ID) |
| `is_indexed` | boolean | Set to `false` for thin/invalid entries to trigger noindex |
| `updated_at` | timestamptz | Must be updated on every upsert so the sitemap can detect changes |

### Upsert Pattern

Use Supabase's upsert with `onConflict: 'slug'` to update existing records without losing editorial data
like `long_description` that may have been set manually.

```typescript
await supabase
  .from('memecoins')
  .upsert(records, { onConflict: 'slug', ignoreDuplicates: false });
```

### Data Sources to Implement (Next Phase)

1. **DexScreener API** — Real-time price, market cap, volume, 24h change for all indexed tokens
   - Endpoint: `https://api.dexscreener.com/latest/dex/tokens/{address}`
   - Rate limit: 300 requests/minute
   - `data_source`: `dexscreener`
   - `external_data_id`: token contract address

2. **CoinGecko API** — Supplementary market data for tokens with CoinGecko listings
   - Endpoint: `https://api.coingecko.com/api/v3/simple/price`
   - `data_source`: `coingecko`
   - `external_data_id`: CoinGecko token ID

3. **pump.fun API** — Discovery of new bonded tokens for automatic seeding
   - Watch for new tokens bonding out to Raydium
   - Auto-set `is_new: true`, `launch_platform: 'pump.fun'`
   - `data_source`: `pump.fun`

### Recommended Implementation

Deploy a Supabase Edge Function on a cron schedule (every 5-15 minutes) that:
1. Fetches updated price/volume data from DexScreener for all tokens in `memecoins` where `data_source = 'dexscreener'`
2. Upserts the updated market data columns
3. Updates `updated_at` to trigger sitemap freshness

No frontend code changes are required — all routes read from Supabase, so updated data appears instantly.
