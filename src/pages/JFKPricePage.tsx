import { ExternalLink, TrendingUp } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumb from '../components/seo/Breadcrumb';
import SEOPageLayout from '../components/seo/SEOPageLayout';
import { buildCanonical, buildBreadcrumbSchema } from '../lib/seo';

const STATS = [
  { label: 'All-Time High Market Cap', value: '~$2.2M', note: 'Reached post-launch' },
  { label: 'Recent Market Cap Spike', value: '~$700K', note: 'Community-driven resurgence' },
  { label: 'Total Supply', value: '1,000,000,000', note: 'JFK tokens' },
  { label: 'Chain', value: 'Solana', note: 'Sub-second finality' },
  { label: 'Launch Date', value: 'May 18, 2024', note: 'Bonded in < 5 minutes' },
  { label: 'Platform', value: 'pump.fun', note: 'Fair launch' },
];

const TRACKERS = [
  {
    name: 'DEXTools',
    url: 'https://www.dextools.io/app/en/solana/pair-explorer/EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39',
    description: 'Live price chart, trading history, liquidity data, and technical analysis.',
  },
  {
    name: 'DexScreener',
    url: 'https://dexscreener.com/solana/EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39',
    description: 'Real-time price, volume, and market cap with detailed trading pair information.',
  },
  {
    name: 'Birdeye',
    url: 'https://birdeye.so/token/EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39',
    description: 'Price tracking, holder analytics, and Solana-native token intelligence.',
  },
  {
    name: 'Solscan',
    url: 'https://solscan.io/token/EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39',
    description: 'On-chain verification, holder count, and transaction history.',
  },
];

export default function JFKPricePage() {
  const canonical = buildCanonical('/jfk-price');

  const jsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://jfk.meme' },
    { name: '$JFK Price', url: canonical },
  ]);

  return (
    <>
      <SEOHead
        title="$JFK Memecoin Price Today - Live Chart & Market Cap | jfk.meme"
        description="Track $JFK memecoin price, market cap, and trading volume. $JFK reached an ATH of $2.2M and recently spiked to $700K. Find where to track $JFK live."
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <SEOPageLayout
        breadcrumb={
          <Breadcrumb items={[
            { name: 'Home', href: '/' },
            { name: '$JFK Price' },
          ]} />
        }
      >
        <article>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              $JFK Memecoin Price & Market Cap
            </h1>
            <p className="text-gray-400 text-lg">
              Track $JFK price, market cap, and key milestones for the original PolitiFi memecoin on Solana.
            </p>
          </header>

          <section className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {STATS.map(stat => (
                <div key={stat.label} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-lg font-black text-[#14f195] mb-0.5">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.note}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Where to Track $JFK Price Live</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TRACKERS.map(tracker => (
                <a
                  key={tracker.name}
                  href={tracker.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-5 hover:border-[#14f195]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white group-hover:text-[#14f195] transition-colors">
                      {tracker.name}
                    </span>
                    <ExternalLink size={14} className="text-gray-500 group-hover:text-[#14f195] transition-colors" />
                  </div>
                  <p className="text-sm text-gray-400">{tracker.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Why Does $JFK's Price Move?</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Like all memecoins, $JFK's price is driven primarily by community activity, narrative momentum,
                and broader crypto market conditions. Unlike tokens with utility or revenue, memecoin valuations
                are a direct function of community belief and social energy.
              </p>
              <p>
                $JFK has demonstrated an unusual pattern for a pump.fun token: multiple distinct price cycles
                over nearly two years. The initial launch in May 2024 created the first wave, reaching an ATH
                of approximately $2.2 million in market cap. Rather than collapsing to near-zero as most pump.fun
                tokens do, $JFK maintained enough community interest to experience subsequent spikes — including
                a recent rise to approximately $700,000.
              </p>
              <p>
                Catalysts for $JFK price movement tend to correlate with: broader PolitiFi narrative waves
                (such as during election cycles or significant political events), general Solana memecoin market
                activity, and organic community-driven promotion on X (formerly Twitter) and Telegram. Because
                $JFK has no team and no marketing budget, its price movements are among the most purely
                organic in the memecoin space.
              </p>
              <p>
                The token's small market cap relative to its community size means that even modest increases in
                buying pressure can produce significant percentage moves. This makes $JFK both potentially
                high-reward and high-risk. Always approach memecoin investments with appropriate risk management.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <div className="bg-[#14f195]/5 border border-[#14f195]/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-[#14f195] mb-2">
                <TrendingUp size={20} />
                <span className="font-bold text-lg">Want to buy $JFK?</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Use the Jupiter swap widget on jfk.meme for the best price on Solana.
              </p>
              <a
                href="/#swap"
                className="inline-flex items-center gap-2 bg-[#14f195] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#14f195]/90 transition-colors"
              >
                Buy $JFK Now →
              </a>
            </div>
          </section>
        </article>
      </SEOPageLayout>
    </>
  );
}
