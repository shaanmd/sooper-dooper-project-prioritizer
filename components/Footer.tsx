export default function Footer() {
  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-200">
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
  );
}
