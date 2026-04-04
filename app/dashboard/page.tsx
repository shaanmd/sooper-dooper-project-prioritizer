"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  name: string;
  description: string;
  passion_level: number;
  goal_alignment: "high" | "medium" | "low";
  is_started: boolean;
  completion_percentage: number;
  created_at: string;
}

function passionColor(level: number): string {
  if (level <= 3) return "#7775A6";
  if (level <= 5) return "#818CF8";
  if (level <= 7) return "#60A5FA";
  if (level <= 8) return "#F5A623";
  if (level <= 9) return "#F97316";
  return "#F43F5E";
}

function passionEmoji(level: number): string {
  if (level <= 2) return "😴";
  if (level <= 4) return "🤔";
  if (level <= 6) return "🙂";
  if (level <= 8) return "🚀";
  if (level <= 9) return "🤩";
  return "🔥";
}

const alignmentStyle: Record<string, string> = {
  high:   "border-emerald-300 bg-emerald-50 text-emerald-700",
  medium: "border-amber-300 bg-amber-50 text-amber-700",
  low:    "border-gray-300 bg-gray-100 text-gray-500",
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white overflow-hidden animate-skeleton">
      <div className="flex">
        <div className="w-1 self-stretch bg-gray-200" />
        <div className="flex-1 p-6 space-y-3">
          <div className="h-5 bg-gray-200 rounded-lg w-2/5" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-3/5" />
          <div className="flex gap-2 pt-1">
            <div className="h-6 w-20 bg-gray-200 rounded-lg" />
            <div className="h-6 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="p-6 flex flex-col items-end justify-between gap-3">
          <div className="h-8 w-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <pre className="text-gray-300 text-xs leading-relaxed mb-6 select-none font-mono">
{`  ╭─────────────╮
  │  ?  ?  ?    │
  │    ╳        │
  │  ?  ?  ?    │
  ╰─────────────╯`}
      </pre>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h2>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
        You have ideas floating around. Let&apos;s capture them before they escape.
      </p>
      <Link
        href="/dashboard/new"
        className="rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-3 text-sm font-bold text-white hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] hover:scale-[1.02] transition-all"
      >
        Create your first project
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("sdpp_projects")
      .select("id, name, description, passion_level, goal_alignment, is_started, completion_percentage, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    await supabase.from("sdpp_projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Your Projects
          {!loading && projects.length > 0 && (
            <span className="ml-3 font-mono text-lg font-normal text-gray-400">
              ({projects.length})
            </span>
          )}
        </h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="pb-24 lg:pb-0">
        <ul className="space-y-4">
          {projects.map((project, i) => {
            const color = passionColor(project.passion_level);
            const isDel = deletingId === project.id;

            return (
              <li
                key={project.id}
                onClick={() => router.push(`/dashboard/${project.id}`)}
                className="animate-card-in group rounded-2xl border-2 border-gray-300 bg-white overflow-hidden hover:border-amber-400 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 cursor-pointer"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex">
                  {/* Passion accent bar */}
                  <div
                    className="w-1 self-stretch flex-none transition-all duration-300 group-hover:w-1.5"
                    style={{ backgroundColor: color }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-base font-bold text-gray-900 leading-tight">
                        {project.name}
                      </h2>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${alignmentStyle[project.goal_alignment] ?? ""}`}
                      >
                        {project.goal_alignment}
                      </span>
                      {project.is_started && (
                        <span className="rounded-md border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                          {project.completion_percentage}% done
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Passion + actions */}
                  <div className="flex-none flex flex-col items-end justify-between p-5 gap-4">
                    {/* Passion number */}
                    <div className="text-right">
                      <div
                        className="font-mono text-2xl font-bold leading-none transition-colors"
                        style={{ color }}
                      >
                        {project.passion_level}
                        <span className="text-gray-400 text-sm font-normal">/10</span>
                      </div>
                      <div className="text-base mt-0.5">{passionEmoji(project.passion_level)}</div>
                    </div>

                    {/* Actions — slide in on hover */}
                    <div
                      className="flex gap-2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/dashboard/edit/${project.id}`}
                        className="rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={isDel}
                        className="rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-rose-400 hover:text-rose-500 disabled:opacity-50 transition-all"
                      >
                        {isDel ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        </div>
      )}

      {/* Sticky Compare button — mobile only */}
      {!loading && projects.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-300 lg:hidden z-50">
          <Link
            href="/dashboard/compare"
            className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
          >
            📊 Compare All Projects
          </Link>
        </div>
      )}
    </div>
  );
}
