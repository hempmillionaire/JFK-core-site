import { supabase } from './supabase';

export interface Coin {
  id: string;
  name: string;
  slug: string;
  ticker: string;
  description: string;
  long_description: string;
  chain: string;
  launch_platform: string;
  contract_address: string;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  is_featured: boolean;
  is_trending: boolean;
  is_new: boolean;
  is_indexed: boolean;
  tags: string[];
  logo_url: string;
  banner_url: string;
  data_source: string;
  external_data_id: string;
  launch_date: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  coin_slug: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  is_active: boolean;
  sort_order: number;
}

export async function getCoinBySlug(slug: string): Promise<Coin | null> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getAllCoins(): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_indexed', true)
    .order('market_cap', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getCoinsByTag(tag: string): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_indexed', true)
    .contains('tags', [tag])
    .order('market_cap', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getCoinsByPlatform(platform: string): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_indexed', true)
    .eq('launch_platform', platform)
    .order('market_cap', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getTrendingCoins(): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_indexed', true)
    .eq('is_trending', true)
    .order('volume_24h', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getNewCoins(): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_indexed', true)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return [];
  return data || [];
}

export async function getRelatedCoins(slug: string, tags: string[], limit = 6): Promise<Coin[]> {
  if (!tags || tags.length === 0) return [];
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_indexed', true)
    .neq('slug', slug)
    .overlaps('tags', tags)
    .order('market_cap', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function getFAQsByCoin(coinSlug: string): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('coin_faqs')
    .select('*')
    .eq('coin_slug', coinSlug)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getCategoryCoins(categorySlug: string): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('category_coins')
    .select('coin_slug, sort_order, memecoins(*)')
    .eq('category_slug', categorySlug)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data || []).map((row: { memecoins: Coin }) => row.memecoins).filter(Boolean);
}

export async function getFeaturedCoin(): Promise<Coin | null> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('*')
    .eq('is_featured', true)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getIndexedCoins(): Promise<Coin[]> {
  const { data, error } = await supabase
    .from('memecoins')
    .select('slug, updated_at')
    .eq('is_indexed', true)
    .order('market_cap', { ascending: false });
  if (error) return [];
  return data || [];
}
