import { AlertTriangle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#14f195]/20 bg-[#050508] mt-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3 text-yellow-500">
            <AlertTriangle className="w-6 h-6" />
            <p className="text-lg font-semibold">
              Crypto is risky. Do your own research.
            </p>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex items-center justify-center gap-2 text-[#14f195]">
            <Heart className="w-5 h-5" />
            <p className="text-base md:text-lg font-semibold">
              Organic community project.
            </p>
            <Heart className="w-5 h-5" />
          </div>

          <div className="pt-6 border-t border-[#14f195]/20">
            <p className="text-gray-500 text-sm">
              $JFK © 2024-2026 | 4 the People | #PolitiFi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
