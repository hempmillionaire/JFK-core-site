import { Shield } from 'lucide-react';

export default function PartnerBar() {
  return (
    <div className="sticky top-0 z-50 bg-[#050508] border-b border-[#14f195]/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <a
          href="https://www.askmastr.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm md:text-base hover:text-[#14f195] transition-colors duration-300"
        >
          <Shield className="w-4 h-4 md:w-5 md:h-5 text-[#14f195]" />
          <span className="font-semibold">MASTR Partner — Rug Insurance</span>
        </a>
      </div>
    </div>
  );
}
