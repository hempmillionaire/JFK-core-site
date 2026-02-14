import { BarChart3 } from 'lucide-react';

export default function ChartSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-[#9945ff]" />
          <h2 className="text-3xl md:text-4xl font-black text-[#9945ff]">
            Live Chart
          </h2>
          <BarChart3 className="w-8 h-8 text-[#9945ff]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-[#9945ff]/5 to-[#14f195]/5 border-2 border-[#9945ff]/30 rounded-2xl p-4 md:p-6 glow-purple">
          <iframe
            src="https://www.dextools.io/widget-chart/en/solana/pe-light/9xPjKDQBotxzRoK9iE1uw7ZckbZZtF8X1gEUGGJUmu2p"
            className="w-full h-[400px] md:h-[600px] rounded-lg"
            frameBorder="0"
            allowFullScreen
            title="DEXTools Chart"
          ></iframe>
          <div className="text-center mt-4">
            <a
              href="https://www.dextools.io/app/en/solana/pair-explorer/9xPjKDQBotxzRoK9iE1uw7ZckbZZtF8X1gEUGGJUmu2p"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#9945ff] text-white rounded-lg font-bold hover:bg-[#7d2ed6] transition-all duration-300 glow-purple"
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Live Chart on DEXTools</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
