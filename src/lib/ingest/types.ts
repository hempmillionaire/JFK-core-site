export interface IngestRecord {
  name: string;
  slug: string;
  ticker: string;
  description: string;
  long_description?: string;
  chain: string;
  launch_platform: string;
  contract_address: string;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  liquidity_usd?: number;
  fdv?: number;
  pair_created_at?: string | null;
  trending_score?: number;
  dexscreener_pair_id?: string;
  dexscreener_pair_url?: string;
  birdeye_url?: string;
  dextools_url?: string;
  image_url?: string;
  website_url?: string;
  x_url?: string;
  telegram_url?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_new?: boolean;
  is_indexed: boolean;
  tags: string[];
  logo_url?: string;
  banner_url?: string;
  data_source: string;
  external_data_id: string;
  launch_date?: string;
}

export type IngestUpsertRecord = IngestRecord & {
  updated_at: string;
};
