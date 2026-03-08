import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex h-14 items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 group flex-none">
              <span className="text-amber-500 text-xl font-black tracking-tight leading-none">
                SDPP
              </span>
              <span className="hidden sm:block text-xs text-gray-400 font-mono uppercase tracking-widest pt-0.5 group-hover:text-gray-600 transition-colors">
                Project Prioritizer
              </span>
            </Link>
            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/dashboard/compare"
                className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors hidden sm:block"
              >
                Compare
              </Link>
              <Link
                href="/dashboard/new"
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-1.5 text-sm font-bold text-white hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] hover:scale-[1.02] transition-all duration-200"
              >
                + New Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
