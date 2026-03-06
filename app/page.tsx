import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#818CF8 1px, transparent 1px), linear-gradient(90deg, #818CF8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      {/* Glow blobs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #F5A623 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #818CF8 0%, transparent 70%)" }}
        aria-hidden
      />

      <main className="relative z-10 text-center max-w-2xl">

        {/* Eyebrow */}
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
          Stop spinning your wheels
        </p>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-cream mb-2">
          The{" "}
          <span
            className="inline-block"
            style={{
              backgroundImage: "linear-gradient(135deg, #F5A623 0%, #F43F5E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Sooper Dooper
          </span>
          <br />
          Project Prioritizer
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-muted max-w-md mx-auto leading-relaxed">
          AI-powered clarity for the side projects, ideas, and half-finished things
          cluttering your brain.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber to-rose px-8 py-4 text-base font-bold text-white tracking-wide hover:shadow-[0_0_40px_rgba(245,166,35,0.4)] hover:scale-[1.02] transition-all duration-200 active:scale-[0.99]"
          >
            <span
              className="animate-shimmer absolute inset-0 w-1/3 bg-white/20 blur-sm"
              aria-hidden
            />
            <span className="relative">Get Started →</span>
          </Link>
        </div>

        {/* Social proof / tagline strip */}
        <div className="mt-16 flex items-center justify-center gap-6 text-xs font-mono text-rim">
          <span>No more decision paralysis</span>
          <span className="text-rim/40">·</span>
          <span>AI-ranked priorities</span>
          <span className="text-rim/40">·</span>
          <span>Free forever</span>
        </div>
      </main>
    </div>
  );
}
