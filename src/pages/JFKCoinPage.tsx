import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumb from '../components/seo/Breadcrumb';
import SEOPageLayout from '../components/seo/SEOPageLayout';
import CoinCard from '../components/seo/CoinCard';
import { getFAQsByCoin, getRelatedCoins, FAQ, Coin } from '../lib/queries';
import { buildCanonical, buildBreadcrumbSchema, buildFAQSchema, formatMarketCap } from '../lib/seo';

const JFK_CONTRACT = 'EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39';

const JFK_STATS = [
  { label: 'Supply', value: '1,000,000,000' },
  { label: 'Launch Date', value: 'May 18, 2024' },
  { label: 'Bonded In', value: '< 5 minutes' },
  { label: 'ATH Market Cap', value: '$2.2M' },
  { label: 'Recent Spike', value: '~$700K' },
  { label: 'Chain', value: 'Solana' },
  { label: 'Platform', value: 'pump.fun' },
  { label: 'Category', value: 'PolitiFi' },
];

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={faq.id} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium text-white text-sm">{faq.question}</span>
            {open === i ? <ChevronUp size={16} className="text-[#14f195] flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-300 leading-relaxed border-t border-[#14f195]/10 pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function JFKCoinPage() {
  const [copied, setCopied] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [related, setRelated] = useState<Coin[]>([]);

  useEffect(() => {
    getFAQsByCoin('jfk').then(setFaqs);
    getRelatedCoins('jfk', ['politifi'], 6).then(setRelated);
  }, []);

  const canonical = buildCanonical('/coin/jfk');

  const jsonLd = [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://jfk.meme' },
      { name: 'Memecoins', url: 'https://jfk.meme/solana-memecoins' },
      { name: '$JFK', url: canonical },
    ]),
    faqs.length > 0 ? buildFAQSchema(faqs.map(f => ({ question: f.question, answer: f.answer }))) : null,
    {
      '@context': 'https://schema.org',
      '@type': 'CryptoToken',
      name: 'JFK Memecoin',
      tickerSymbol: 'JFK',
      description: '$JFK is a PolitiFi memecoin on Solana launched on pump.fun on May 18, 2024.',
      url: canonical,
    },
  ].filter(Boolean);

  function handleCopy() {
    navigator.clipboard.writeText(JFK_CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <SEOHead
        title="JFK Memecoin ($JFK) - Price, Chart & Info | jfk.meme"
        description="Everything about $JFK memecoin on Solana. Contract address, price history, ATH of $2.2M, how to buy, and community info for the original PolitiFi token."
        canonical={canonical}
        jsonLd={jsonLd as object[]}
      />
      <SEOPageLayout
        bannerVariant="self"
        breadcrumb={
          <Breadcrumb items={[
            { name: 'Home', href: '/' },
            { name: 'Memecoins', href: '/solana-memecoins' },
            { name: '$JFK' },
          ]} />
        }
      >
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#14f195]/10 flex items-center justify-center text-[#14f195] font-black text-2xl">
                JFK
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">JFK Memecoin</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#14f195] font-mono font-bold">$JFK</span>
                  <span className="text-xs bg-[#14f195]/10 text-[#14f195] px-2 py-0.5 rounded-full">Solana</span>
                  <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">pump.fun</span>
                  <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">PolitiFi</span>
                </div>
              </div>
            </div>
          </header>

          <section className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {JFK_STATS.map(stat => (
                <div key={stat.label} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-sm font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#0f1420] border border-[#14f195]/20 rounded-xl p-4 mb-6">
              <div className="text-xs text-gray-500 mb-2 font-medium">Contract Address (Solana)</div>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-[#14f195] font-mono text-xs sm:text-sm break-all">{JFK_CONTRACT}</code>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-[#14f195]/10 text-[#14f195] hover:bg-[#14f195]/20 transition-colors flex-shrink-0"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={`https://solscan.io/token/${JFK_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  Solscan <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="bg-[#0f1420] rounded-xl overflow-hidden border border-[#14f195]/10 mb-6">
              <div className="p-4 border-b border-[#14f195]/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">$JFK Live Chart</span>
                <a
                  href={`https://www.dextools.io/app/en/solana/pair-explorer/${JFK_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#14f195] hover:underline flex items-center gap-1"
                >
                  Open in DEXTools <ExternalLink size={10} />
                </a>
              </div>
              <div style={{ height: '400px' }}>
                <iframe
                  src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${JFK_CONTRACT}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=false`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="$JFK DEXTools Chart"
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="/#swap"
                className="flex items-center gap-2 bg-[#14f195] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#14f195]/90 transition-colors"
              >
                <TrendingUp size={16} />
                Buy $JFK on Jupiter
              </a>
              <a
                href={`https://pump.fun/coin/${JFK_CONTRACT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                View on pump.fun <ExternalLink size={14} />
              </a>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">About $JFK Memecoin</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                $JFK is one of the most remarkable survival stories in the Solana memecoin ecosystem. Launched on
                May 18, 2024, via pump.fun — Solana's premier fair-launch platform — the token achieved something
                extraordinary: it bonded out (graduated from the pump.fun launchpad to full DEX trading) in under
                5 minutes. This lightning-fast bonding is exceptionally rare and reflects the intensity of organic
                community demand at launch.
              </p>
              <p>
                Unlike the thousands of pump.fun tokens that collapse within days or weeks of launch, $JFK has
                maintained an active community and trading activity approaching two years after its debut. This
                longevity places it in an elite category of pump.fun tokens that transcended the typical
                speculative lifecycle to build something with genuine cultural staying power.
              </p>
              <p>
                The token's narrative draws on one of the most enduring figures in American political mythology.
                John F. Kennedy occupies a unique position in the cultural imagination — his assassination, the
                conspiracy theories surrounding it, his vision for America, and his place in the collective memory
                create a narrative that resonates across generations. This depth of narrative is what separates
                $JFK from memecoins built around fleeting internet trends.
              </p>
              <p>
                $JFK reached an all-time high market cap of approximately $2.2 million — a significant achievement
                for a fully community-driven token with no institutional backing, no marketing budget, and no paid
                promoters. More recently, it experienced a renewed spike to approximately $700,000 in market cap,
                demonstrating that community interest persists years after most comparable tokens have gone to zero.
              </p>
              <p>
                The token is 100% community-driven. There is no identifiable founding team, no paid KOLs
                artificially inflating volume, no bots running wash trading, and no team allocation that was
                silently dumped on buyers. Every holder of $JFK chose to be here through organic discovery —
                and that authenticity is the foundation of its resilience.
              </p>
              <p>
                $JFK trades on the Solana blockchain with a total supply of 1 billion tokens. It is accessible
                via the Jupiter DEX aggregator, which is embedded directly on jfk.meme for convenient purchasing.
                The token can be verified on Solscan and tracked on DEXTools and DexScreener using its contract
                address.
              </p>
            </div>
          </section>

          {faqs.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <FAQAccordion faqs={faqs} />
            </section>
          )}

          {related.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">Related PolitiFi Tokens</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map(coin => <CoinCard key={coin.slug} coin={coin} />)}
              </div>
            </section>
          )}
        </article>
      </SEOPageLayout>
    </>
  );
}
