import { Zap } from 'lucide-react';

export default function SwapSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-[#14f195]" />
            <h2 className="text-3xl md:text-4xl font-black text-[#14f195]">
              Swap SOL → $JFK
            </h2>
            <Zap className="w-8 h-8 text-[#14f195]" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <iframe
            src="https://jup.ag/swap/SOL-EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39"
            width="100%"
            height="650"
            style={{ maxWidth: '520px', borderRadius: '20px', border: '1px solid #14f195' }}
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
