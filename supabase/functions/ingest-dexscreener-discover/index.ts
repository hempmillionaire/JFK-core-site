import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEXSCREENER_BASE = "https://api.dexscreener.com";
const MIN_LIQUIDITY = 5000;

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function contractHashSuffix(contractAddress: string): string {
  return contractAddress.slice(0, 6).toLowerCase();
}

interface DexPair {
  pairAddress: string;
  url: string;
  chainId: string;
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
    source: "dexscreener-discover",
    status: "running",
  });

  try {
    const res = await fetch(
      `${DEXSCREENER_BASE}/token-profiles/latest/v1`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) throw new Error(`DexScreener discover HTTP ${res.status}`);

    const body = await res.json();
    const profiles: { tokenAddress?: string; chainId?: string }[] = Array.isArray(body) ? body : [];

    const solanaProfiles = profiles.filter(
      (p) => p.chainId === "solana" && p.tokenAddress
    );

    coinsProcessed = solanaProfiles.length;

    const { data: existingContracts } = await supabase
      .from("memecoins")
      .select("contract_address, slug");

    const existingSlugs = new Set<string>(
      (existingContracts || []).map((r: { slug: string }) => r.slug)
    );
    const existingAddresses = new Map<string, string>(
      (existingContracts || []).map((r: { contract_address: string; slug: string }) => [
        r.contract_address.toLowerCase(),
        r.slug,
      ])
    );

    for (const profile of solanaProfiles) {
      const contractAddress = profile.tokenAddress!;

      if (existingAddresses.has(contractAddress.toLowerCase())) {
        continue;
      }

      try {
        const pairRes = await fetch(
          `${DEXSCREENER_BASE}/tokens/v1/solana/${contractAddress}`,
          { headers: { Accept: "application/json" } }
        );
        if (!pairRes.ok) {
          errors.push(`${contractAddress}: pair fetch HTTP ${pairRes.status}`);
          continue;
        }

        const pairBody = await pairRes.json();
        const pairs: DexPair[] = Array.isArray(pairBody)
          ? pairBody
          : (pairBody.pairs ?? []);

        const solanaPairs = pairs.filter(
          (p) =>
            p.chainId === "solana" &&
            p.baseToken?.address?.toLowerCase() === contractAddress.toLowerCase()
        );

        if (solanaPairs.length === 0) {
          errors.push(`${contractAddress}: no Solana pairs`);
          continue;
        }

        const best = solanaPairs.reduce((a, b) =>
          (a.liquidity?.usd ?? 0) >= (b.liquidity?.usd ?? 0) ? a : b
        );

        const liquidityUsd = best.liquidity?.usd ?? 0;
        const volumeH24 = best.volume?.h24 ?? 0;

        if (liquidityUsd < MIN_LIQUIDITY || volumeH24 <= 0) {
          continue;
        }

        const name = best.baseToken?.name ?? "";
        const ticker = best.baseToken?.symbol ?? "";

        if (!name || !ticker) {
          errors.push(`${contractAddress}: missing name or ticker`);
          continue;
        }

        let baseSlug = toSlug(name) || toSlug(ticker);
        if (!baseSlug) {
          errors.push(`${contractAddress}: could not generate slug`);
          continue;
        }

        let finalSlug = baseSlug;
        if (existingSlugs.has(baseSlug)) {
          finalSlug = `${baseSlug}-${contractHashSuffix(contractAddress)}`;
          if (existingSlugs.has(finalSlug)) {
            errors.push(`${contractAddress}: slug collision even with suffix, skipping`);
            continue;
          }
        }

        const priceUsd = parseFloat(best.priceUsd ?? "0") || 0;
        const marketCap = best.fdv ?? 0;
        const priceChange24h = best.priceChange?.h24 ?? 0;
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

        const shortDescription = `${name} ($${ticker}) is a Solana memecoin trading on decentralized exchanges.`;

        const record = {
          name,
          slug: finalSlug,
          ticker,
          description: shortDescription,
          long_description: "",
          chain: "solana",
          launch_platform: "pump.fun",
          contract_address: contractAddress,
          price_usd: priceUsd,
          market_cap: marketCap,
          volume_24h: volumeH24,
          price_change_24h: priceChange24h,
          liquidity_usd: liquidityUsd,
          fdv,
          pair_created_at: pairCreatedAt ? new Date(pairCreatedAt).toISOString() : null,
          dexscreener_pair_id: dexscreenerPairId,
          dexscreener_pair_url: dexscreenerPairUrl,
          image_url: imageUrl,
          website_url: websiteUrl,
          x_url: xUrl,
          telegram_url: telegramUrl,
          tags: ["solana"],
          is_indexed: true,
          is_featured: false,
          is_trending: false,
          is_new: true,
          data_source: "dexscreener",
          external_data_id: dexscreenerPairId,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from("memecoins")
          .insert(record);

        if (upsertError) {
          errors.push(`${contractAddress}: insert failed - ${upsertError.message}`);
          continue;
        }

        existingSlugs.add(finalSlug);
        existingAddresses.set(contractAddress.toLowerCase(), finalSlug);
        coinsUpdated++;
      } catch (e) {
        errors.push(`${contractAddress}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    await supabase.from("ingestion_jobs").update({
      finished_at: new Date().toISOString(),
      coins_processed: coinsProcessed,
      coins_updated: coinsUpdated,
      errors,
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
