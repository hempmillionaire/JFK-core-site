import { Coins, Calendar, Zap, TrendingUp, Users } from 'lucide-react';

export default function TokenInfo() {
  const stats = [
    {
      icon: Coins,
      label: 'Total Supply',
      value: '1,000,000,000',
      color: 'text-[#14f195]'
    },
    {
      icon: Calendar,
      label: 'Launched',
      value: 'May 18, 2024',
      subtext: 'pump.fun',
      color: 'text-[#9945ff]'
    },
    {
      icon: Zap,
      label: 'Bonded Out',
      value: '< 5 Minutes',
      color: 'text-[#14f195]'
    },
    {
      icon: TrendingUp,
      label: 'ATH Market Cap',
      value: '$2.1M',
      subtext: '9 months after launch',
      color: 'text-[#9945ff]'
    },
    {
      icon: Users,
      label: 'Community',
      value: '100% Organic',
      color: 'text-[#14f195]'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl font-black text-center mb-8 md:mb-12 text-[#14f195]">
        Token Info
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-[#14f195]/5 to-[#9945ff]/5 border-2 border-[#14f195]/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 glow-green-hover"
            >
              <Icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 ${stat.color}`} />
              <p className="text-sm md:text-base text-gray-400 mb-2">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>
                {stat.value}
              </p>
              {stat.subtext && (
                <p className="text-xs md:text-sm text-gray-500 mt-2">{stat.subtext}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-[#14f195]/10 border-2 border-[#14f195] rounded-2xl p-8 glow-green">
          <p className="text-xl md:text-2xl font-bold text-[#14f195] leading-relaxed">
            No paid KOLs. No fake volume. No bots.
          </p>
        </div>
      </div>
    </section>
  );
}
