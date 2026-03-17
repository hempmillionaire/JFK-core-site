import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PartnerBar from './components/PartnerBar';
import Header from './components/Header';
import Hero from './components/Hero';
import ContractBlock from './components/ContractBlock';
import ActionButtons from './components/ActionButtons';
import SwapSection from './components/SwapSection';
import TokenInfo from './components/TokenInfo';
import ChartSection from './components/ChartSection';
import QuoteSection from './components/QuoteSection';
import NFTSection from './components/NFTSection';
import SocialsFooter from './components/SocialsFooter';
import Footer from './components/Footer';
import HomepageSEOContent from './components/HomepageSEOContent';

const JFKCoinPage = lazy(() => import('./pages/JFKCoinPage'));
const HowToBuyPage = lazy(() => import('./pages/HowToBuyPage'));
const JFKPricePage = lazy(() => import('./pages/JFKPricePage'));
const JFKContractPage = lazy(() => import('./pages/JFKContractPage'));
const CoinPage = lazy(() => import('./pages/CoinPage'));
const SolanaMemecoinsCategoryPage = lazy(() => import('./pages/categories/SolanaMemecoinsCategoryPage'));
const PumpFunCategoryPage = lazy(() => import('./pages/categories/PumpFunCategoryPage'));
const TrendingCategoryPage = lazy(() => import('./pages/categories/TrendingCategoryPage'));
const NewCoinsCategoryPage = lazy(() => import('./pages/categories/NewCoinsCategoryPage'));
const PolitifiCategoryPage = lazy(() => import('./pages/categories/PolitifiCategoryPage'));

function Homepage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://plugin.jup.ag/main-v2.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Jupiter) {
        window.Jupiter.init({
          displayMode: 'integrated',
          integratedTargetId: 'jupiter-plugin',
          defaultInputMint: 'So11111111111111111111111111111111111111112',
          defaultOutputMint: 'EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39',
          theme: {
            mode: 'dark',
            primary: '#14f195',
            secondary: '#9945ff',
          },
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <PartnerBar />
      <Header />
      <Hero />
      <ContractBlock />
      <ActionButtons />
      <SwapSection />
      <TokenInfo />
      <ChartSection />
      <QuoteSection />
      <NFTSection />
      <SocialsFooter />
      <Footer />
      <HomepageSEOContent />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0b0b12] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#14f195] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/coin/jfk" element={<JFKCoinPage />} />
        <Route path="/how-to-buy-jfk" element={<HowToBuyPage />} />
        <Route path="/jfk-price" element={<JFKPricePage />} />
        <Route path="/jfk-contract" element={<JFKContractPage />} />
        <Route path="/solana-memecoins" element={<SolanaMemecoinsCategoryPage />} />
        <Route path="/pump-fun-memecoins" element={<PumpFunCategoryPage />} />
        <Route path="/trending-memecoins" element={<TrendingCategoryPage />} />
        <Route path="/new-memecoins" element={<NewCoinsCategoryPage />} />
        <Route path="/politifi-memecoins" element={<PolitifiCategoryPage />} />
        <Route path="/coin/:slug" element={<CoinPage />} />
      </Routes>
    </Suspense>
  );
}
