import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#FAFAF9] flex flex-col"
      style={{
        backgroundImage:
          "linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Top Badge */}
      <div className="flex justify-center pt-6 pb-0 mb-0">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 border-2 border-amber-300 rounded-full shadow-sm">
          <span className="text-base md:text-lg font-bold text-amber-700">
            Too many ideas? Same.
          </span>
        </div>
      </div>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-3 -mt-4">
            MEET THE
          </p>

          <h1 className="font-extrabold leading-tight tracking-tight mb-6">
            <span
              className="block text-5xl sm:text-6xl lg:text-7xl"
              style={{
                backgroundImage: "linear-gradient(135deg, #F5A623 0%, #F97316 50%, #F43F5E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sooper Dooper
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl text-gray-900">Project Prioritizer</span>
          </h1>

          {/* Subtitles */}
          <p className="text-xl md:text-2xl text-gray-600 mb-3 max-w-2xl mx-auto leading-relaxed">
            Skip idea speed dating and marry the right one.
          </p>
          <p className="text-lg text-amber-600 font-semibold mb-8">
            Our AI-powered matchmaker will see you right.
          </p>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="relative overflow-hidden inline-block bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:via-orange-600 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg hover:scale-105 active:scale-[0.99]"
          >
            <span
              className="animate-shimmer absolute inset-0 w-1/3 bg-white/20 blur-sm"
              aria-hidden
            />
            <span className="relative">Get Started →</span>
          </Link>

          {/* Link to machine page */}
          <div className="mt-6">
            <Link
              href="/machine"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-base transition-all group hover:gap-3"
            >
              <span>Want to see the machine? We made it whimsical!</span>
              <span className="text-xl group-hover:animate-bounce">✨</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Audience Cards */}
      <div className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-sm uppercase tracking-widest text-gray-400 mb-8">
            Built For
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 text-center shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
              <div className="text-3xl mb-3">🛠️</div>
              <h3 className="font-bold text-gray-900 text-lg">Makers</h3>
              <p className="text-sm text-gray-600 mt-2">Build the right thing, not everything</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 text-center shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-900 text-lg">Entrepreneurs</h3>
              <p className="text-sm text-gray-600 mt-2">Validate ideas before you build</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 text-center shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-bold text-gray-900 text-lg">Creators</h3>
              <p className="text-sm text-gray-600 mt-2">Focus your creative energy</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white border-t-2 border-gray-300">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Three steps to clarity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Add Your Ideas",
                desc: "List all your project ideas with passion levels and goals",
              },
              {
                step: "2",
                title: "AI Research",
                desc: "Claude analyzes demand, competitors, costs, and timeline",
              },
              {
                step: "3",
                title: "See Winners",
                desc: "Bubble chart shows high-value, low-effort projects instantly",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-amber-600">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          {/* Main Footer Card */}
          <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-lg p-8 text-center">
            {/* Company Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-200 rounded-full mb-4">
                <span className="text-sm font-bold text-amber-700">SD Vet Studio</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dr Deb Prattley &amp; Dr Shaan Mocke
              </h3>
              <p className="text-sm text-gray-600">
                Veterinarians who learned to code · Built in 48 hours
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-gray-300 mx-auto my-6" />

            {/* Tech Stack */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Powered By
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Next.js · TypeScript · Tailwind · Supabase<br />
                Claude Code · Gemini 3 · Cursor · Antigravity · AI Studio · Coffee
              </p>
            </div>

            {/* Hackathon Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400">AI Hackathon · March 2026</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">© 2026 SD Vet Studio · Australia &amp; New Zealand</p>
          </div>
        </div>
      </div>
    </div>
  );
}
