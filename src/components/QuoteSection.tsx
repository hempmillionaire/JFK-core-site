export default function QuoteSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14f195] to-[#9945ff]">
                "The very word 'secrecy' is repugnant in a free and open society…"
              </span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#14f195] to-[#9945ff] glow-green"></span>
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
