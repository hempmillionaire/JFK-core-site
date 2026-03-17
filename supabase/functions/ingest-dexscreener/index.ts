import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEXSCREENER_BASE = "https://api.dexscreener.com";
const TRENDING_ON_THRESHOLD = 70;
const TRENDING_OFF_THRESHOLD = 40;

function computeTrendingScore(
  volume24h: number,
  priceChange24h: number,
  liquidityUsd: number,
  pairCreatedAt: number | null
): number {
  const volumeScore = Math.min(100, Math.log10(Math.max(volume24h, 1)) * 10);
  const changeScore = Math.min(100, Math.abs(priceChange24h));
  const liquidityScore = Math.min(100, Math.log10(Math.max(liquidityUsd, 1)) * 8);

  let recencyScore = 0;
  if (pairCreatedAt) {
    const ageHours = (Date.now() - pairCreatedAt) / (1000 * 60 * 60);
    recencyScore = Math.max(0, 100 - ageHours / 2.4);
  }

  return Math.round(
    volumeScore * 0.35 +
    changeScore * 0.25 +
    liquidityScore * 0.25 +
    recencyScore * 0.15
  );
}

interface DexPair {
  pairAddress: string;
  url: string;
  priceUsd?: string;
  fdv?: number;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: { type: string; url: string }[];
  };
  baseToken?: { address: string; name: string; symbol: string };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jobId = crypto.randomUUID();
  const errors: string[] = [];
  let coinsProcessed = 0;
  let coinsUpdated = 0;

  await supabase.from("ingestion_jobs").insert({
    id: jobId,
    source: "dexscreener",
    status: "running",
  });

  try {
    const { data: coins, error: fetchError } = await supabase
      .from("memecoins")
      .select("slug, contract_address, is_featured, dexscreener_pair_id")
      .eq("is_indexed", true)
      .not("contract_address", "eq", "");

    if (fetchError) throw new Error(`Failed to fetch coins: ${fetchError.message}`);

    const coinList = coins || [];
    coinsProcessed = coinList.length;

    for (const coin of coinList) {
      try {
        const res = await fetch(
          `${DEXSCREENER_BASE}/tokens/v1/solana/${coin.contract_address}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) {
          errors.push(`${coin.slug}: HTTP ${res.status}`);
          continue;
        }

        const body = await res.json();
        const pairs: DexPair[] = Array.isArray(body) ? body : (body.pairs ?? []);

        if (!pairs || pairs.length === 0) {
          errors.push(`${coin.slug}: no pairs returned`);
          continue;
        }

        const solanaPairs = pairs.filter(
          (p) => p.baseToken?.address?.toLowerCase() === coin.contract_address.toLowerCase()
        );

        if (solanaPairs.length === 0) {
          errors.push(`${coin.slug}: no Solana pairs found`);
          continue;
        }

        const best = solanaPairs.reduce((a, b) =>
          (a.liquidity?.usd ?? 0) >= (b.liquidity?.usd ?? 0) ? a : b
        );

        const priceUsd = parseFloat(best.priceUsd ?? "0") || 0;
        const marketCap = best.fdv ?? 0;
        const volumeH24 = best.volume?.h24 ?? 0;
        const priceChange24h = best.priceChange?.h24 ?? 0;
        const liquidityUsd = best.liquidity?.usd ?? 0;
        const fdv = best.fdv ?? 0;
        const pairCreatedAt = best.pairCreatedAt ?? null;
        const dexscreenerPairId = best.pairAddress ?? "";
        const dexscreenerPairUrl = best.url ?? "";

        const info = best.info ?? {};
        const imageUrl = info.imageUrl ?? "";
        const websiteUrl = (info.websites ?? [])[0]?.url ?? "";
        const xSocial = (info.socials ?? []).find((s) => s.type === "twitter");
        const xUrl = xSocial?.url ?? "";
        const tgSocial = (info.socials ?? []).find((s) => s.type === "telegram");
        const telegramUrl = tgSocial?.url ?? "";

        const trendingScore = computeTrendingScore(
          volumeH24,
          priceChange24h,
          liquidityUsd,
          pairCreatedAt
        );

        const updatePayload: Record<string, unknown> = {
          price_usd: priceUsd,
          market_cap: marketCap,
          volume_24h: volumeH24,
          price_change_24h: priceChange24h,
          liquidity_usd: liquidityUsd,
          fdv: fdv,
          dexscreener_pair_id: dexscreenerPairId,
          dexscreener_pair_url: dexscreenerPairUrl,
          trending_score: trendingScore,
          is_trending: trendingScore >= TRENDING_ON_THRESHOLD
            ? true
            : trendingScore < TRENDING_OFF_THRESHOLD
            ? false
            : undefined,
          updated_at: new Date().toISOString(),
        };

        if (pairCreatedAt) {
          updatePayload.pair_created_at = new Date(pairCreatedAt).toISOString();
        }

        if (imageUrl) updatePayload.image_url = imageUrl;
        if (websiteUrl) updatePayload.website_url = websiteUrl;
        if (xUrl) updatePayload.x_url = xUrl;
        if (telegramUrl) updatePayload.telegram_url = telegramUrl;

        if (updatePayload.is_trending === undefined) {
          delete updatePayload.is_trending;
        }

        if (coin.is_featured) {
          delete updatePayload.dextools_url;
          delete updatePayload.long_description;
          delete updatePayload.is_featured;
        }

        const { error: updateError } = await supabase
          .from("memecoins")
          .update(updatePayload)
          .eq("slug", coin.slug);

        if (updateError) {
          errors.push(`${coin.slug}: update failed - ${updateError.message}`);
          continue;
        }

        await supabase.from("coin_market_log").insert({
          coin_slug: coin.slug,
          price_usd: priceUsd,
          market_cap: marketCap,
          volume_24h: volumeH24,
          price_change_24h: priceChange24h,
          liquidity_usd: liquidityUsd,
          fdv: fdv,
        });

        coinsUpdated++;
      } catch (e) {
        errors.push(`${coin.slug}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    await supabase.from("ingestion_jobs").update({
      finished_at: new Date().toISOString(),
      coins_processed: coinsProcessed,
      coins_updated: coinsUpdated,
      errors: errors,
      status: "success",
    }).eq("id", jobId);

    return new Response(
      JSON.stringify({ success: true, coinsProcessed, coinsUpdated, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase.from("ingestion_jobs").update({
      finished_at: new Date().toISOString(),
      coins_processed: coinsProcessed,
      coins_updated: coinsUpdated,
      errors: [...errors, msg],
      status: "failed",
    }).eq("id", jobId);

    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
