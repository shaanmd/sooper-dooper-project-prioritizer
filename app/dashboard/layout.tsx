import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink">
      {/* Nav */}
      <nav className="border-b border-rim bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex h-14 items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 group flex-none">
              <span className="text-amber text-xl font-black tracking-tight leading-none">
                SDPP
              </span>
              <span className="hidden sm:block text-xs text-muted font-mono uppercase tracking-widest pt-0.5 group-hover:text-cream transition-colors">
                Project Prioritizer
              </span>
            </Link>
            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/dashboard/compare"
                className="text-xs font-mono uppercase tracking-widest text-muted hover:text-cream transition-colors hidden sm:block"
              >
                Compare
              </Link>
              <Link
                href="/dashboard/new"
                className="relative overflow-hidden rounded-lg bg-amber px-4 py-1.5 text-sm font-bold text-ink hover:bg-amber-2 transition-colors"
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
