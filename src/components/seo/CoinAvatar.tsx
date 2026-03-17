import { useState } from 'react';

interface CoinAvatarProps {
  imageUrl?: string;
  ticker: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function CoinAvatar({ imageUrl, ticker, size = 'md', className = '' }: CoinAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = sizeMap[size];
  const letters = ticker.slice(0, 2).toUpperCase();

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={ticker}
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#14f195]/10 flex items-center justify-center text-[#14f195] font-bold flex-shrink-0 ${className}`}
    >
      {letters}
    </div>
  );
}
