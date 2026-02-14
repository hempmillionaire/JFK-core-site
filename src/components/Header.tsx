export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-center gap-3">
        <img
          src="/image.png"
          alt="$JFK Logo"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full glow-green object-cover"
        />
        <span className="px-3 py-1 md:px-4 md:py-1.5 bg-[#14f195]/10 border border-[#14f195] rounded-full text-xs md:text-sm font-bold text-[#14f195] glow-green">
          Organic Only
        </span>
      </div>
    </header>
  );
}
