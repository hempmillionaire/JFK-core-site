import { Link, useLocation } from 'react-router-dom';
import { Home, Coins, TrendingUp, Zap, ShoppingCart, FileText } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'jfk.meme', icon: Home },
  { href: '/coin/jfk', label: '$JFK Token', icon: Coins },
  { href: '/solana-memecoins', label: 'Solana Memecoins', icon: TrendingUp },
  { href: '/pump-fun-memecoins', label: 'Pump.fun Coins', icon: Zap },
  { href: '/trending-memecoins', label: 'Trending', icon: TrendingUp },
  { href: '/how-to-buy-jfk', label: 'How to Buy JFK', icon: ShoppingCart },
];

export default function InternalNav() {
  const location = useLocation();

  return (
    <nav className="mt-12 border-t border-[#14f195]/10 pt-8">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-medium">
        Explore
      </div>
      <div className="flex flex-wrap gap-2">
        {navLinks.map(link => {
          const Icon = link.icon;
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-[#14f195]/20 text-[#14f195] border border-[#14f195]/30'
                  : 'bg-[#0f1420] text-gray-400 hover:text-[#14f195] hover:bg-[#14f195]/10 border border-[#14f195]/10'
              }`}
            >
              <Icon size={13} />
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
        <Link to="/politifi-memecoins" className="hover:text-[#14f195] transition-colors">PolitiFi Memecoins</Link>
        <span>·</span>
        <Link to="/new-memecoins" className="hover:text-[#14f195] transition-colors">New Memecoins</Link>
        <span>·</span>
        <Link to="/jfk-price" className="hover:text-[#14f195] transition-colors">$JFK Price</Link>
        <span>·</span>
        <Link to="/jfk-contract" className="hover:text-[#14f195] transition-colors">$JFK Contract</Link>
      </div>
    </nav>
  );
}
