import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BIRDEYE_BASE = "https://public-api.birdeye.so";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const birdeyeApiKey = Deno.env.get("BIRDEYE_API_KEY") ?? "";

  const jobId = crypto.randomUUID();
  const errors: string[] = [];
  let coinsProcessed = 0;
  let coinsUpdated = 0;

  await supabase.from("ingestion_jobs").insert({
    id: jobId,
    source: "birdeye",
    status: "running",
  });

  try {
    const { data: coins, error: fetchError } = await supabase
      .from("memecoins")
      .select("slug, contract_address, image_url, website_url, x_url, telegram_url, birdeye_url")
      .eq("is_indexed", true)
      .not("contract_address", "eq", "");

    if (fetchError) throw new Error(`Failed to fetch coins: ${fetchError.message}`);

    const coinList = coins || [];
    coinsProcessed = coinList.length;

    for (const coin of coinList) {
      try {
        const birdeyeUrl = `https://birdeye.so/token/${coin.contract_address}?chain=solana`;

        const needsMetadata =
          !coin.image_url ||
          !coin.website_url ||
          !coin.x_url ||
          !coin.telegram_url;

        const updatePayload: Record<string, unknown> = {
          birdeye_url: birdeyeUrl,
          updated_at: new Date().toISOString(),
        };

        if (needsMetadata && birdeyeApiKey) {
          const res = await fetch(
            `${BIRDEYE_BASE}/defi/token_overview?address=${coin.contract_address}`,
            {
              headers: {
                Accept: "application/json",
                "X-API-KEY": birdeyeApiKey,
                "x-chain": "solana",
              },
            }
          );

          if (res.ok) {
            const body = await res.json();
            const tokenData = body?.data ?? {};

            if (!coin.image_url && tokenData.logoURI) {
              updatePayload.image_url = tokenData.logoURI;
            }
            if (!coin.website_url && tokenData.extensions?.website) {
              updatePayload.website_url = tokenData.extensions.website;
            }
            if (!coin.x_url && tokenData.extensions?.twitter) {
              updatePayload.x_url = tokenData.extensions.twitter;
            }
            if (!coin.telegram_url && tokenData.extensions?.telegram) {
              updatePayload.telegram_url = tokenData.extensions.telegram;
            }
          }
        }

        const { error: updateError } = await supabase
          .from("memecoins")
          .update(updatePayload)
          .eq("slug", coin.slug);

        if (updateError) {
          errors.push(`${coin.slug}: ${updateError.message}`);
          continue;
        }

        coinsUpdated++;
      } catch (e) {
        errors.push(`${coin.slug}: ${e instanceof Error ? e.message : String(e)}`);
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
