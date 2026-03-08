"use client";

import { useState } from "react";

interface AIResearchButtonProps {
  projectId: string;
  onComplete?: (data: Record<string, unknown>) => void;
}

export default function AIResearchButton({ projectId, onComplete }: AIResearchButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Research failed. Please try again.");
        return;
      }
      onComplete?.(json);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={[
          "relative w-full overflow-hidden rounded-xl px-6 py-4",
          "bg-gradient-to-r from-amber-400 to-rose-500",
          "font-bold text-base text-white tracking-wide",
          "transition-all duration-200",
          "hover:shadow-[0_0_32px_rgba(245,166,35,0.35)] hover:scale-[1.01]",
          "active:scale-[0.99]",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
        ].join(" ")}
      >
        {/* Shimmer */}
        {!isLoading && (
          <span
            className="animate-shimmer absolute inset-0 w-1/3 bg-white/20 blur-sm"
            aria-hidden
          />
        )}

        <span className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <span
                className="animate-spin-slow block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              Researching Market…
            </>
          ) : (
            <>
              <span aria-hidden>🔍</span>
              Analyse with AI
            </>
          )}
        </span>
      </button>

      {error && (
        <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
