import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Coin } from '../../lib/queries';
import { formatMarketCap, formatChange } from '../../lib/seo';
import CoinAvatar from './CoinAvatar';

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const changePositive = coin.price_change_24h >= 0;

  return (
    <Link
      to={`/coin/${coin.slug}`}
      className="block bg-[#0f1420] border border-[#14f195]/10 rounded-xl p-4 hover:border-[#14f195]/40 hover:bg-[#0f1420]/80 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <CoinAvatar imageUrl={coin.image_url} ticker={coin.ticker} size="md" />
          <div>
            <div className="font-semibold text-white text-sm leading-tight group-hover:text-[#14f195] transition-colors">
              {coin.name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">${coin.ticker}</div>
          </div>
        </div>
        <span className="text-xs bg-[#14f195]/10 text-[#14f195] px-2 py-0.5 rounded-full font-medium">
          {coin.chain}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Market Cap</div>
          <div className="text-sm font-semibold text-white">
            {formatMarketCap(coin.market_cap)}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${changePositive ? 'text-[#14f195]' : 'text-red-400'}`}>
          {changePositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatChange(coin.price_change_24h)}
        </div>
      </div>

      <div className="mt-3 text-xs text-[#14f195]/70 font-medium">
        View Token →
      </div>
    </Link>
  );
}
