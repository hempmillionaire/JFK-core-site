import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ContractBlock() {
  const [copied, setCopied] = useState(false);
  const contractAddress = 'EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#14f195]/5 border-2 border-[#14f195] rounded-2xl p-6 md:p-8 glow-green-hover transition-all duration-300">
          <label className="block text-sm md:text-base font-semibold text-gray-400 mb-3">
            Contract Address
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 bg-[#0b0b12] border border-[#14f195]/30 rounded-lg px-4 py-3 font-mono text-xs md:text-sm break-all">
              {contractAddress}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#14f195] text-[#0b0b12] rounded-lg font-bold hover:bg-[#0fd085] transition-all duration-300 glow-green-hover"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
