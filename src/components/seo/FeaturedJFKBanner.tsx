import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

interface FeaturedJFKBannerProps {
  variant?: 'default' | 'self';
}

export default function FeaturedJFKBanner({ variant = 'default' }: FeaturedJFKBannerProps) {
  if (variant === 'self') {
    return (
      <div className="my-10 bg-[#0f1420] border border-[#14f195]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#14f195]/10 flex items-center justify-center text-[#14f195] font-black text-xl flex-shrink-0">
          JFK
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="text-white font-semibold mb-1">You're exploring $JFK - the OG PolitiFi memecoin on Solana.</div>
          <div className="text-sm text-gray-400">Launched May 18, 2024. Bonded in under 5 minutes. Nearly 2 years of community survival.</div>
        </div>
        <a
          href="/#swap"
          className="flex-shrink-0 flex items-center gap-2 bg-[#14f195] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-[#14f195]/90 transition-colors text-sm"
        >
          <Rocket size={15} />
          Buy $JFK
        </a>
      </div>
    );
  }

  return (
    <div className="my-10 bg-[#0f1420] border border-[#14f195]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#14f195]/10 flex items-center justify-center text-[#14f195] font-black text-xl flex-shrink-0">
        JFK
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="text-white font-semibold mb-1">$JFK — The original PolitiFi memecoin on Solana</div>
        <div className="text-sm text-gray-400">Community-driven. No team. No bots. Nearly 2 years old. $2.2M ATH.</div>
      </div>
      <Link
        to="/#swap"
        className="flex-shrink-0 flex items-center gap-2 bg-[#14f195] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-[#14f195]/90 transition-colors text-sm"
      >
        <Rocket size={15} />
        Buy on Jupiter
      </Link>
    </div>
  );
}
