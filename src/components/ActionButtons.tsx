import { TrendingUp, Users, MessageCircle, Search, BarChart3, Rocket } from 'lucide-react';

export default function ActionButtons() {
  const buttons = [
    {
      label: 'Buy on Dexscreener',
      url: 'https://dexscreener.com/solana/9xPjKDQBotxzRoK9iE1uw7ZckbZZtF8X1gEUGGJUmu2p',
      icon: TrendingUp,
      primary: true
    },
    {
      label: 'Join Our X Community',
      url: 'https://x.com/i/communities/1851642092239397252',
      icon: Users,
      primary: true
    },
    {
      label: 'Telegram',
      url: 'https://t.me/jfkcoins',
      icon: MessageCircle,
      primary: false
    },
    {
      label: 'Solscan',
      url: 'https://solscan.io/token/EzRasdye3wnQ5ZGzLFhvp2L1TT42k3Qa3jFsoUibWh39',
      icon: Search,
      primary: false
    },
    {
      label: 'DEXTools',
      url: 'https://www.dextools.io/app/en/solana/pair-explorer/9xPjKDQBotxzRoK9iE1uw7ZckbZZtF8X1gEUGGJUmu2p',
      icon: BarChart3,
      primary: false
    },
    {
      label: 'Pump.fun',
      url: 'https://join.pump.fun/HSag/lrw2f0sk',
      icon: Rocket,
      primary: false
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {buttons.map((button) => {
          const Icon = button.icon;
          return (
            <a
              key={button.label}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
                button.primary
                  ? 'bg-[#14f195] text-[#0b0b12] hover:bg-[#0fd085] glow-green-hover'
                  : 'bg-[#9945ff]/10 border-2 border-[#9945ff] text-[#9945ff] hover:bg-[#9945ff] hover:text-white glow-purple'
              }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
              <span>{button.label}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
