import { useState } from 'react';
import { Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumb from '../components/seo/Breadcrumb';
import SEOPageLayout from '../components/seo/SEOPageLayout';
import { buildCanonical, buildBreadcrumbSchema, buildFAQSchema, buildHowToSchema } from '../lib/seo';

const JFK_CONTRACT = 'EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39';

const STEPS = [
  {
    number: '01',
    name: 'Get a Solana Wallet',
    text: 'Download Phantom (phantom.app) or Solflare (solflare.com) — the two most trusted Solana wallets. Install the browser extension or mobile app. Create a new wallet and store your seed phrase somewhere safe offline. Never share your seed phrase with anyone.',
  },
  {
    number: '02',
    name: 'Buy SOL on an Exchange',
    text: 'Purchase SOL on a centralized exchange like Coinbase, Kraken, or Binance. Complete their identity verification (KYC) process, then buy at least $20-50 worth of SOL to cover your $JFK purchase plus transaction fees (Solana fees are fractions of a cent, so fees are negligible).',
  },
  {
    number: '03',
    name: 'Transfer SOL to Your Wallet',
    text: 'Withdraw your SOL from the exchange to your Phantom or Solflare wallet address. Copy your wallet address from the wallet app, paste it in the exchange withdrawal screen, and confirm. SOL transfers typically arrive in under 30 seconds on Solana.',
  },
  {
    number: '04',
    name: 'Go to jfk.meme and Use the Jupiter Swap',
    text: 'Navigate to jfk.meme and scroll to the swap section. The Jupiter DEX aggregator is embedded directly on the page, pre-configured to swap SOL for $JFK. Connect your wallet, enter the amount of SOL you want to swap, review the transaction details, and confirm.',
  },
  {
    number: '05',
    name: 'You Now Hold $JFK',
    text: 'After the transaction confirms (usually under 1 second on Solana), $JFK tokens will appear in your wallet. You can verify your holding on Solscan by searching your wallet address. Congratulations — you are now part of the $JFK community.',
  },
];

const FAQS = [
  {
    question: 'What wallet do I need to buy $JFK?',
    answer: 'You need a Solana-compatible wallet. Phantom (phantom.app) and Solflare (solflare.com) are the most popular options. Both have browser extensions and mobile apps. Download one, create a wallet, and securely store your seed phrase before you do anything else.',
  },
  {
    question: 'How much SOL do I need to buy $JFK?',
    answer: 'You can buy any amount of $JFK. Start with however much SOL you want to invest. Solana transaction fees are less than $0.001, so fees are never a meaningful factor. We recommend having at least $20 in SOL to make a meaningful purchase.',
  },
  {
    question: 'Why should I use Jupiter to buy $JFK?',
    answer: 'Jupiter is the leading DEX aggregator on Solana. It automatically routes your swap through multiple liquidity sources to find you the best possible price for $JFK. It is the same swap infrastructure embedded directly on jfk.meme for your convenience.',
  },
  {
    question: 'Is it safe to buy $JFK?',
    answer: 'Always verify the $JFK contract address before any transaction: EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39. Only use this verified address. Like all memecoins, $JFK involves significant risk and is highly speculative. Never invest more than you can afford to lose.',
  },
  {
    question: 'Can I buy $JFK on a centralized exchange?',
    answer: '$JFK is currently traded on Solana DEXs via Jupiter and similar aggregators, not on major centralized exchanges. The easiest way to buy is through the swap widget on jfk.meme.',
  },
  {
    question: 'How do I know I bought the right $JFK token?',
    answer: 'The only legitimate $JFK contract address is EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39. Verify this on Solscan or pump.fun before swapping. The Jupiter widget on jfk.meme is pre-configured with the correct token address.',
  },
];

function FAQAccordion({ faqs }: { faqs: typeof FAQS }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl overflow-hidden">
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

export default function HowToBuyPage() {
  const [copied, setCopied] = useState(false);
  const canonical = buildCanonical('/how-to-buy-jfk');

  const jsonLd = [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://jfk.meme' },
      { name: 'How to Buy $JFK', url: canonical },
    ]),
    buildHowToSchema(
      'How to Buy $JFK Memecoin on Solana',
      'Step-by-step guide to buying $JFK memecoin using a Solana wallet and Jupiter DEX.',
      STEPS.map(s => ({ name: s.name, text: s.text }))
    ),
    buildFAQSchema(FAQS),
  ];

  function handleCopy() {
    navigator.clipboard.writeText(JFK_CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <SEOHead
        title="How to Buy $JFK Memecoin on Solana - Step by Step Guide"
        description="Complete guide to buying $JFK memecoin on Solana. Get a Phantom wallet, buy SOL, and swap for $JFK using Jupiter — the easiest way to join the $JFK community."
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <SEOPageLayout
        breadcrumb={
          <Breadcrumb items={[
            { name: 'Home', href: '/' },
            { name: 'How to Buy $JFK' },
          ]} />
        }
      >
        <article>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              How to Buy $JFK Memecoin
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Buying $JFK on Solana takes under 5 minutes. Here's the complete step-by-step guide.
            </p>
          </header>

          <section className="mb-10">
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={i} className="bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-6 flex gap-5">
                  <div className="text-[#14f195] font-black text-2xl w-10 flex-shrink-0 leading-none mt-0.5">
                    {step.number}
                  </div>
                  <div>
                    <h2 className="font-bold text-white mb-2">{step.name}</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">$JFK Contract Address</h2>
            <div className="bg-[#0f1420] border border-[#14f195]/20 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-3">
                Always verify this address before transacting. The only legitimate $JFK contract is:
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-[#14f195] font-mono text-xs sm:text-sm break-all">{JFK_CONTRACT}</code>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#14f195]/10 text-[#14f195] hover:bg-[#14f195]/20 transition-colors flex-shrink-0"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={`https://solscan.io/token/${JFK_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  Verify on Solscan <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="bg-[#14f195]/5 border border-[#14f195]/20 rounded-xl p-6 text-center">
              <div className="text-white font-bold text-lg mb-2">Ready to buy $JFK?</div>
              <p className="text-gray-400 text-sm mb-4">
                The Jupiter swap is embedded directly on the homepage — no external sites needed.
              </p>
              <a
                href="/#swap"
                className="inline-flex items-center gap-2 bg-[#14f195] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#14f195]/90 transition-colors"
              >
                Go to Swap Widget →
              </a>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <FAQAccordion faqs={FAQS} />
          </section>
        </article>
      </SEOPageLayout>
    </>
  );
}
