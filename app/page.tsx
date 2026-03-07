import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#F5A623 1px, transparent 1px), linear-gradient(90deg, #F5A623 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />


      <main className="relative z-10 text-center max-w-3xl">

        {/* Badge */}
        <p className="inline-block font-semibold text-base text-amber-600 mb-8 bg-amber-50 rounded-full px-6 py-2">
          Too many ideas? Same.
        </p>

        {/* Title */}
        <h1 className="font-extrabold leading-tight tracking-tight text-gray-900 mb-2">
          <span className="block text-lg font-semibold tracking-[0.15em] uppercase text-gray-400 mb-2">Meet the</span>
          <span
            className="block text-6xl sm:text-7xl"
            style={{
              backgroundImage: "linear-gradient(135deg, #F5A623 0%, #F43F5E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Sooper Dooper
          </span>
          <span className="block text-7xl sm:text-8xl">Project Prioritizer</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          Skip your idea speed dating and marry the right one.
        </p>
        <p className="mt-2 text-xl font-semibold text-amber-500 max-w-lg mx-auto leading-relaxed">
          Our AI-powered matchmaker will see you right.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-8 py-4 text-base font-bold text-white tracking-wide hover:shadow-[0_0_40px_rgba(245,166,35,0.4)] hover:scale-[1.02] transition-all duration-200 active:scale-[0.99]"
          >
            <span
              className="animate-shimmer absolute inset-0 w-1/3 bg-white/20 blur-sm"
              aria-hidden
            />
            <span className="relative">Get Started →</span>
          </Link>
        </div>

        {/* Tagline strip */}
        <div className="mt-8 flex items-center justify-center gap-6 text-lg font-semibold text-gray-500">
          <span>Makers</span>
          <span className="text-amber-300">·</span>
          <span>Entrepreneurs</span>
          <span className="text-amber-300">·</span>
          <span>Creators</span>
        </div>
      </main>
    </div>
  );
}