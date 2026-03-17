import { Link } from 'react-router-dom';
import FeaturedJFKBanner from './FeaturedJFKBanner';
import InternalNav from './InternalNav';

interface SEOPageLayoutProps {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
  hideBanner?: boolean;
  bannerVariant?: 'default' | 'self';
}

export default function SEOPageLayout({
  children,
  breadcrumb,
  hideBanner = false,
  bannerVariant = 'default',
}: SEOPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <header className="border-b border-[#14f195]/10 bg-[#0b0b12]/95 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-[#14f195] font-black text-xl tracking-tight">JFK</span>
            <span className="text-white font-semibold text-sm opacity-60">.meme</span>
          </Link>
          <Link
            to="/#swap"
            className="text-xs font-semibold bg-[#14f195]/10 text-[#14f195] border border-[#14f195]/20 px-3 py-1.5 rounded-lg hover:bg-[#14f195]/20 transition-colors"
          >
            Buy $JFK
          </Link>
        </div>
      </header>

      <main role="main" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {breadcrumb && <div>{breadcrumb}</div>}
        {children}
        {!hideBanner && <FeaturedJFKBanner variant={bannerVariant} />}
        <InternalNav />
      </main>

      <footer className="border-t border-[#14f195]/10 mt-8 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            jfk.meme is a community resource site for $JFK memecoin information. This is not financial advice.
            Cryptocurrency trading involves significant risk. Always do your own research before investing.
            $JFK is a memecoin with no intrinsic value or expectation of financial return.
          </p>
        </div>
      </footer>
    </div>
  );
}
