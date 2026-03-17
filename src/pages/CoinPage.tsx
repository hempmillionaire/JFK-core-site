import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumb from '../components/seo/Breadcrumb';
import SEOPageLayout from '../components/seo/SEOPageLayout';
import CoinCard from '../components/seo/CoinCard';
import { getCoinBySlug, getFAQsByCoin, getRelatedCoins, Coin, FAQ } from '../lib/queries';
import { buildCanonical, buildBreadcrumbSchema, buildFAQSchema, formatMarketCap, formatPrice, formatChange } from '../lib/seo';

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

function CoinSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0b12] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#14f195] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NotFound({ slug }: { slug: string }) {
  return (
    <>
      <SEOHead
        title="Coin Not Found | jfk.meme"
        description="This memecoin could not be found. Browse our full list of Solana memecoins."
        canonical={buildCanonical(`/coin/${slug}`)}
        robots="noindex, nofollow"
      />
      <SEOPageLayout>
        <div className="py-20 text-center">
          <div className="text-6xl font-black text-[#14f195]/20 mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-4">Coin Not Found</h1>
          <p className="text-gray-400 mb-8">
            We couldn't find a coin with the slug <code className="text-[#14f195] font-mono">/{slug}</code>.
            It may have been delisted or the URL may be incorrect.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/solana-memecoins" className="bg-[#14f195] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-[#14f195]/90 transition-colors text-sm">
              Browse Solana Memecoins
            </Link>
            <Link to="/" className="bg-white/5 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm border border-white/10">
              Go Home
            </Link>
          </div>
        </div>
      </SEOPageLayout>
    </>
  );
}

export default function CoinPage() {
  const { slug } = useParams<{ slug: string }>();
  const [coin, setCoin] = useState<Coin | null | undefined>(undefined);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [related, setRelated] = useState<Coin[]>([]);

  useEffect(() => {
    if (!slug) return;
    getCoinBySlug(slug).then(data => {
      setCoin(data);
      if (data && data.is_indexed) {
        getFAQsByCoin(slug).then(setFaqs);
        getRelatedCoins(slug, data.tags || [], 6).then(setRelated);
      }
    });
  }, [slug]);

  if (coin === undefined) return <CoinSkeleton />;
  if (coin === null || !coin.is_indexed) return <NotFound slug={slug || ''} />;

  const canonical = buildCanonical(`/coin/${coin.slug}`);
  const changePositive = coin.price_change_24h >= 0;

  const jsonLd = [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://jfk.meme' },
      { name: 'Memecoins', url: 'https://jfk.meme/solana-memecoins' },
      { name: `$${coin.ticker}`, url: canonical },
    ]),
    ...(faqs.length > 0 ? [buildFAQSchema(faqs.map(f => ({ question: f.question, answer: f.answer })))] : []),
  ];

  const stats = [
    { label: 'Market Cap', value: formatMarketCap(coin.market_cap) },
    { label: 'Price', value: formatPrice(coin.price_usd) },
    { label: '24h Change', value: formatChange(coin.price_change_24h), green: changePositive },
    { label: '24h Volume', value: formatMarketCap(coin.volume_24h) },
    { label: 'Chain', value: coin.chain },
    { label: 'Platform', value: coin.launch_platform || 'Unknown' },
  ];

  return (
    <>
      <SEOHead
        title={`${coin.name} ($${coin.ticker}) Price & Info | jfk.meme`}
        description={coin.description || `Info and price data for ${coin.name} ($${coin.ticker}) on ${coin.chain}.`}
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <SEOPageLayout
        breadcrumb={
          <Breadcrumb items={[
            { name: 'Home', href: '/' },
            { name: 'Memecoins', href: '/solana-memecoins' },
            { name: `$${coin.ticker}` },
          ]} />
        }
      >
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#14f195]/10 flex items-center justify-center text-[#14f195] font-black text-lg flex-shrink-0">
                {coin.ticker.slice(0, 2)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{coin.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[#14f195] font-mono font-bold">${coin.ticker}</span>
                  <span className="text-xs bg-[#14f195]/10 text-[#14f195] px-2 py-0.5 rounded-full">{coin.chain}</span>
                  {coin.launch_platform && (
                    <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{coin.launch_platform}</span>
                  )}
                </div>
              </div>
            </div>
          </header>

          <section className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map(stat => (
                <div key={stat.label} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className={`text-sm font-bold ${'green' in stat && stat.green !== undefined ? (stat.green ? 'text-[#14f195]' : 'text-red-400') : 'text-white'}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {coin.tags && coin.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {coin.tags.map(tag => (
                <span key={tag} className="text-xs bg-[#14f195]/10 text-[#14f195]/80 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">About {coin.name}</h2>
            <p className="text-gray-300 leading-relaxed">
              {coin.long_description || coin.description}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Track {coin.name} Live</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://dexscreener.com/solana/${coin.contract_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0f1420] border border-[#14f195]/10 text-gray-300 px-4 py-2 rounded-xl hover:border-[#14f195]/30 hover:text-white transition-all text-sm"
              >
                DexScreener <ExternalLink size={12} />
              </a>
              <a
                href={`https://www.dextools.io/app/en/solana/pair-explorer/${coin.contract_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0f1420] border border-[#14f195]/10 text-gray-300 px-4 py-2 rounded-xl hover:border-[#14f195]/30 hover:text-white transition-all text-sm"
              >
                DEXTools <ExternalLink size={12} />
              </a>
              <a
                href={`https://solscan.io/token/${coin.contract_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0f1420] border border-[#14f195]/10 text-gray-300 px-4 py-2 rounded-xl hover:border-[#14f195]/30 hover:text-white transition-all text-sm"
              >
                Solscan <ExternalLink size={12} />
              </a>
            </div>
          </section>

          {faqs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">FAQ</h2>
              <FAQAccordion faqs={faqs} />
            </section>
          )}

          {related.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Related Coins</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map(c => <CoinCard key={c.slug} coin={c} />)}
              </div>
            </section>
          )}
        </article>
      </SEOPageLayout>
    </>
  );
}
