import { Twitter, Users, Instagram, Music, MessageCircle } from 'lucide-react';

export default function SocialsFooter() {
  const socials = [
    {
      name: 'X',
      url: 'https://x.com/jfkcoinsol',
      icon: Twitter,
      color: 'hover:text-[#14f195]'
    },
    {
      name: 'X Community',
      url: 'https://x.com/i/communities/1851642092239397252',
      icon: Users,
      color: 'hover:text-[#14f195]'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/jfkcoinsol',
      icon: Instagram,
      color: 'hover:text-[#9945ff]'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@jfkcoinsol',
      icon: Music,
      color: 'hover:text-[#14f195]'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/jfkcoins',
      icon: MessageCircle,
      color: 'hover:text-[#9945ff]'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-8 text-[#14f195]">
          Join the Community
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-[#14f195]/5 to-[#9945ff]/5 border-2 border-[#14f195]/30 rounded-2xl transition-all duration-300 hover:scale-110 glow-green-hover ${social.color}`}
                aria-label={social.name}
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10" />
                <span className="text-sm md:text-base font-semibold">{social.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
