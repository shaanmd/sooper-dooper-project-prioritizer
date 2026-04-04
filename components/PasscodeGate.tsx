"use client";

import { useState, useEffect } from "react";

const PASSCODE = "sdsdpt26";
const STORAGE_KEY = "sdpp_access";

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === PASSCODE) {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, PASSCODE);
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#FAFAF9]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-3xl text-gray-900 mb-2">
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #F5A623 0%, #F97316 50%, #F43F5E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sooper Dooper
            </span>
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Project Prioritizer</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Enter access code</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder="••••••••"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-colors ${
                error ? "border-rose-400 bg-rose-50" : "border-gray-300 focus:border-amber-400"
              }`}
            />
            {error && (
              <p className="text-sm text-rose-500 text-center">Incorrect code. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:via-orange-600 hover:to-rose-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
