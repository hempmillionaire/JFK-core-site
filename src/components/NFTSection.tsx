import { Coins } from 'lucide-react';

export default function NFTSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#14f195]/10 to-[#9945ff]/10 border-2 border-[#14f195] rounded-3xl p-8 md:p-12 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-2xl overflow-hidden glow-green">
            <img
              src="/14f195nft.jpg"
              alt="14F195 Green Square"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#14f195]">
            14F195 Solana Green Squares
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-gray-300 font-semibold">
            Stake for $JFK rewards
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="https://launchmynft.io/sol/5080"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[#14f195] text-[#0b0b12] rounded-xl font-bold text-lg hover:bg-[#0fd085] transition-all duration-300 glow-green-hover"
            >
              <Coins className="w-6 h-6" />
              <span>Mint Now — 0.06 SOL</span>
            </a>

            <a
              href="https://www.solsuite.io/14f195"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[#9945ff] text-white rounded-xl font-bold text-lg hover:bg-[#7d2ed6] transition-all duration-300 glow-purple"
            >
              <Coins className="w-6 h-6" />
              <span>Stake Now for $JFK</span>
            </a>
          </div>

          <a
            href="https://twitter.com/14f195"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#14f195] hover:text-[#0fd085] font-semibold text-lg transition-colors"
          >
            @14f195 squares
          </a>
        </div>
      </div>
    </section>
  );
}
