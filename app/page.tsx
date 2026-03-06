import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-6">
      <main className="text-center text-white max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          The Sooper Dooper Project Prioritizer
        </h1>
        <p className="mt-4 text-lg text-purple-100 sm:text-xl">
          Stop spinning your wheels. AI-powered project prioritization.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-purple-600 shadow-sm transition hover:bg-purple-50"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
