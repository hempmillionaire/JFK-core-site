import { useEffect, useState } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SEOPageLayout from '../../components/seo/SEOPageLayout';
import CoinCard from '../../components/seo/CoinCard';
import { getCategoryCoins, Coin } from '../../lib/queries';
import { buildCanonical, buildBreadcrumbSchema } from '../../lib/seo';

interface CategoryPageTemplateProps {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  editorial: React.ReactNode;
}

export default function CategoryPageTemplate({
  slug,
  title,
  metaTitle,
  metaDescription,
  headline,
  subheadline,
  editorial,
}: CategoryPageTemplateProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryCoins(slug).then(data => {
      setCoins(data);
      setLoading(false);
    });
  }, [slug]);

  const canonical = buildCanonical(`/${slug}`);
  const jsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://jfk.meme' },
    { name: title, url: canonical },
  ]);

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <SEOPageLayout
        breadcrumb={
          <Breadcrumb items={[
            { name: 'Home', href: '/' },
            { name: title },
          ]} />
        }
      >
        <div>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{headline}</h1>
            <p className="text-gray-400 text-lg">{subheadline}</p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-4 animate-pulse h-28" />
              ))}
            </div>
          ) : coins.length > 0 ? (
            <section className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coins.map(coin => <CoinCard key={coin.slug} coin={coin} />)}
              </div>
            </section>
          ) : (
            <section className="mb-12">
              <div className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-8 text-center text-gray-400">
                No coins found in this category.
              </div>
            </section>
          )}

          <section className="prose prose-invert max-w-none">
            {editorial}
          </section>
        </div>
      </SEOPageLayout>
    </>
  );
}
