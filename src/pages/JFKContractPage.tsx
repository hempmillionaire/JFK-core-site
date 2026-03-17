import { useState } from 'react';
import { Copy, Check, ExternalLink, Shield, Lock, XCircle } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumb from '../components/seo/Breadcrumb';
import SEOPageLayout from '../components/seo/SEOPageLayout';
import { buildCanonical, buildBreadcrumbSchema } from '../lib/seo';

const JFK_CONTRACT = 'EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39';

const SECURITY_NOTES = [
  {
    icon: Shield,
    label: 'No Mint Authority',
    description: 'The mint authority has been revoked. No entity can create new $JFK tokens beyond the original 1 billion supply.',
  },
  {
    icon: Lock,
    label: 'LP Locked',
    description: 'Liquidity pool tokens are locked, preventing rug pulls where the team drains all liquidity and leaves holders with worthless tokens.',
  },
  {
    icon: XCircle,
    label: 'Renounced Ownership',
    description: 'Contract ownership has been renounced. No single party has admin control over the $JFK smart contract.',
  },
];

const VERIFY_STEPS = [
  {
    step: '1',
    title: 'Check on Solscan',
    description: 'Visit solscan.io and paste the contract address. Under "Token Info" you can verify supply, decimals, and whether mint authority has been revoked.',
  },
  {
    step: '2',
    title: 'Confirm on pump.fun',
    description: 'Visit pump.fun and search for the contract address to confirm it matches the original fair launch. You can see the full bonding curve history.',
  },
  {
    step: '3',
    title: 'Cross-check on DEXTools',
    description: 'Search the contract on dextools.io to verify the pair address, liquidity depth, and trading history. DEXTools shows the full price history from launch.',
  },
  {
    step: '4',
    title: 'Verify with Jupiter',
    description: 'The token should appear correctly in Jupiter\'s token list when you paste the contract address. Jupiter performs its own token verification.',
  },
];

export default function JFKContractPage() {
  const [copied, setCopied] = useState(false);
  const canonical = buildCanonical('/jfk-contract');

  const jsonLd = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://jfk.meme' },
    { name: '$JFK Contract', url: canonical },
  ]);

  function handleCopy() {
    navigator.clipboard.writeText(JFK_CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <SEOHead
        title="$JFK Memecoin Contract Address - Verified Solana Token"
        description="The verified $JFK memecoin contract address on Solana: EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39. Security notes, verification guide, and on-chain links."
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <SEOPageLayout
        breadcrumb={
          <Breadcrumb items={[
            { name: 'Home', href: '/' },
            { name: '$JFK Contract' },
          ]} />
        }
      >
        <article>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              $JFK Contract Address
            </h1>
            <p className="text-gray-400 text-lg">
              The verified contract address for $JFK memecoin on the Solana blockchain.
            </p>
          </header>

          <section className="mb-10">
            <div className="bg-[#0f1420] border border-[#14f195]/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-[#14f195]" />
                <span className="text-sm font-semibold text-[#14f195]">Verified Contract Address</span>
              </div>
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <code className="text-[#14f195] font-mono text-xs sm:text-sm break-all leading-relaxed">
                  {JFK_CONTRACT}
                </code>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-[#14f195] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#14f195]/90 transition-colors text-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
                <a
                  href={`https://solscan.io/token/${JFK_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 text-gray-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10"
                >
                  Solscan <ExternalLink size={12} />
                </a>
                <a
                  href={`https://pump.fun/coin/${JFK_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 text-gray-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10"
                >
                  pump.fun <ExternalLink size={12} />
                </a>
                <a
                  href={`https://dexscreener.com/solana/${JFK_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 text-gray-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10"
                >
                  DexScreener <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Security Notes</h2>
            <div className="space-y-4">
              {SECURITY_NOTES.map(note => {
                const Icon = note.icon;
                return (
                  <div key={note.label} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#14f195]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#14f195]" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">{note.label}</div>
                      <p className="text-sm text-gray-400 leading-relaxed">{note.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">How to Verify $JFK On-Chain</h2>
            <div className="space-y-3">
              {VERIFY_STEPS.map(step => (
                <div key={step.step} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-5 flex gap-4">
                  <div className="text-[#14f195] font-black text-xl w-8 flex-shrink-0 leading-none mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{step.title}</div>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
              <div className="font-semibold text-yellow-400 mb-2 text-sm">Security Warning</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Always verify the contract address before making any transaction. There are copycat tokens
                that use similar names but different addresses. The only legitimate $JFK on Solana is{' '}
                <code className="text-[#14f195] font-mono text-xs">{JFK_CONTRACT}</code>.
                Never accept a contract address from social media without verifying it on Solscan first.
              </p>
            </div>
          </section>
        </article>
      </SEOPageLayout>
    </>
  );
}
