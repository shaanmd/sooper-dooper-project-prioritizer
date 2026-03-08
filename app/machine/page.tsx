"use client";

import Footer from "@/components/Footer";

export default function MachineLanding() {
  return (
    <div 
      className="min-h-screen bg-[#FAFAF9] py-12 px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-200 rounded-full mb-6 animate-pulse">
            <span className="text-sm font-semibold text-amber-700">
              Feed Your Ideas to the Machine!
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
              The Sooper Dooper
            </span>
            <br />
            <span className="text-gray-900">Project Prioritizer Sorting Machine</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch your project ideas flow through our whimsical contraption
          </p>
        </div>

        {/* Machine with Annotations */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_500px_280px] gap-3 items-center mb-16">
          {/* Left Annotations */}
          <div className="hidden lg:flex flex-col justify-around h-full space-y-12 -mr-12">
            <div className="text-right animate-fade-in-left">
              <div className="inline-block bg-white border-2 border-amber-300 rounded-xl p-3 shadow-lg max-w-xs">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-bold text-gray-900 mb-1">Step 1: Ideas In</h3>
                <p className="text-sm text-gray-600">
                  Dump all your half-baked project ideas into the hopper
                </p>
              </div>
            </div>

            <div className="text-right animate-fade-in-left delay-200 -mt-24">
              <div className="inline-block bg-white border-2 border-rose-300 rounded-xl p-3 shadow-lg max-w-xs">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-bold text-gray-900 mb-1">Step 3: Bubbles Sort</h3>
                <p className="text-sm text-gray-600">
                  Projects plotted on value vs effort bubble chart
                </p>
              </div>
            </div>
          </div>

          {/* Center: Machine Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/gem.png"
                alt="Project Sorting Machine"
                className="w-full max-w-lg animate-float drop-shadow-2xl"
              />

              {/* Sparkle effects */}
              <div className="absolute top-8 -left-4 text-3xl animate-pulse">✨</div>
              <div className="absolute top-12 -right-4 text-3xl animate-pulse delay-500">✨</div>
              <div className="absolute bottom-20 -left-6 text-3xl animate-pulse delay-1000">⭐</div>
              <div className="absolute bottom-16 -right-6 text-3xl animate-pulse delay-700">⭐</div>
            </div>
          </div>

          {/* Right Annotations */}
          <div className="hidden lg:flex flex-col justify-around h-full space-y-12 -ml-12">
            <div className="text-left animate-fade-in-right">
              <div className="inline-block bg-white border-2 border-indigo-300 rounded-xl p-3 shadow-lg max-w-xs">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-bold text-gray-900 mb-1">Step 2: AI Analyzes</h3>
                <p className="text-sm text-gray-600">
                  Claude researches demand, costs, effort, timeline
                </p>
              </div>
            </div>

            <div className="text-left animate-fade-in-right delay-200 -mt-24">
              <div className="inline-block bg-white border-2 border-amber-300 rounded-xl p-3 shadow-lg max-w-xs">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-bold text-gray-900 mb-1">Step 4: Winner!</h3>
                <p className="text-sm text-gray-600">
                  Top-right bubbles are your winners to build first
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Steps (shown on small screens) */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white border-2 border-amber-300 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-bold text-gray-900 mb-1">Ideas In</h3>
            <p className="text-xs text-gray-600">Dump all your ideas</p>
          </div>
          <div className="bg-white border-2 border-indigo-300 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-gray-900 mb-1">AI Analyzes</h3>
            <p className="text-xs text-gray-600">Research each one</p>
          </div>
          <div className="bg-white border-2 border-rose-300 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-1">Bubbles Sort</h3>
            <p className="text-xs text-gray-600">Plot value vs effort</p>
          </div>
          <div className="bg-white border-2 border-amber-300 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold text-gray-900 mb-1">Winner!</h3>
            <p className="text-xs text-gray-600">Build the best ones</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold px-12 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all text-xl transform hover:scale-105"
          >
            Fire Up The Machine →
          </a>
          <p className="text-sm text-gray-500 mt-4">
            No credit card. No PhD in project management. Just clarity.
          </p>
        </div>

        {/* Why This Works */}
        <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why entrepreneurs love the machine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">Stop Guessing</h3>
              <p className="text-sm text-gray-600">
                Data-driven decisions instead of gut feelings
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">Save Time</h3>
              <p className="text-sm text-gray-600">
                AI research in seconds vs. weeks of Googling
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-gray-900 mb-2">Ship Winners</h3>
              <p className="text-sm text-gray-600">
                Focus energy on high-value, low-effort projects
              </p>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pb-8">
          <a 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Prefer the professional version? →
          </a>
        </div>
      </div>

      <Footer />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}