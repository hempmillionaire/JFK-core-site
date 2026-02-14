export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 text-center">
      <blockquote className="mb-6 md:mb-8">
        <p className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-glow-green">
          "We choose to go to the Moon — not because it is easy, but because it is hard."
        </p>
        <cite className="text-lg md:text-xl text-gray-400">— John F. Kennedy</cite>
      </blockquote>

      <div className="max-w-2xl mx-auto my-8 md:my-12">
        <img
          src="/jfkdjt.jpg"
          alt="JFK Meme"
          className="w-full h-auto rounded-2xl border-2 border-[#14f195] glow-green"
        />
      </div>

      <div className="space-y-4 md:space-y-6 mt-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#14f195]">
          $JFK — 4 the People. #PolitiFi
        </h1>

        <p className="text-xl md:text-2xl font-bold text-[#14f195] text-glow-green">
          Bonded out &lt; 5 minutes.
        </p>

        <div className="max-w-3xl mx-auto mt-8 p-6 md:p-8 bg-gradient-to-br from-[#14f195]/5 to-[#9945ff]/5 border border-[#14f195]/30 rounded-2xl">
          <p className="text-base md:text-lg lg:text-xl leading-relaxed font-semibold">
            "We are tired of the crypto elite, scammers, and bad actors. Its time to break free with a crypto revolution. 4 the people! #PolitiFi"
          </p>
        </div>
      </div>
    </section>
  );
}
