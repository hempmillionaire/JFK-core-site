import { useState, useEffect } from 'react';
import { Copy, Check, Shield, Rocket, Users, TrendingUp, Zap } from 'lucide-react';
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

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://plugin.jup.ag/main-v2.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Jupiter) {
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "jupiter-plugin",
          defaultInputMint: "So11111111111111111111111111111111111111112",
          defaultOutputMint: "EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39",
          theme: {
            mode: "dark",
            primary: "#14f195",
            secondary: "#9945ff"
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
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
    </div>
  );
}

export default App;
