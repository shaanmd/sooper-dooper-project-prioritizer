"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AIResearchButton from "@/components/AIResearchButton";

interface Project {
  id: string;
  name: string;
  description: string;
  passion_level: number;
  goal_alignment: "low" | "medium" | "high";
  learning_goals: string[];
  constraints: string;
  is_started: boolean;
  completion_percentage: number;
  created_at: string;
}

interface AIResearch {
  demand_score: number;
  competitors: { name: string; url: string; pricing: string }[];
  unique_selling_point: string;
  revenue_min: number;
  revenue_max: number;
  suggested_pricing: number;
  build_cost_initial: number;
  build_cost_monthly: number;
  time_to_build_weeks: number;
  audience_size_score: number;
  accessibility_score: number;
  skills_required: string[];
  assumptions: string;
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

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8 ? "text-emerald-700 border-emerald-300 bg-emerald-50" :
    score >= 5 ? "text-amber-700 border-amber-300 bg-amber-50" :
                 "text-gray-500 border-gray-300 bg-gray-100";
  return (
    <div className={`rounded-xl border-2 px-4 py-3 text-center ${color}`}>
      <div className="font-mono text-2xl font-bold">{score}<span className="text-sm font-normal opacity-60">/10</span></div>
      <div className="text-xs font-semibold uppercase tracking-widest mt-0.5 opacity-70">{label}</div>
    </div>
  );
}

function ResearchPanel({ research }: { research: AIResearch }) {
  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">AI Research</h2>

      {/* Scores row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ScoreBadge label="Demand" score={research.demand_score} />
        <ScoreBadge label="Audience Size" score={research.audience_size_score} />
        <ScoreBadge label="Reachability" score={research.accessibility_score} />
        <div className="rounded-xl border-2 border-indigo-300 bg-indigo-50 px-4 py-3 text-center">
          <div className="font-mono text-2xl font-bold text-indigo-600">{research.time_to_build_weeks}<span className="text-sm font-normal opacity-60">w</span></div>
          <div className="text-xs font-semibold uppercase tracking-widest mt-0.5 text-indigo-500">Build Time</div>
        </div>
      </div>

      {/* USP */}
      <div className="rounded-xl border-2 border-gray-300 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Unique Angle</p>
        <p className="text-sm text-gray-700 leading-relaxed">{research.unique_selling_point}</p>
      </div>

      {/* Revenue + Costs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-gray-300 bg-white p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Revenue Estimate</p>
          <div className="font-mono text-gray-900">
            <span className="text-2xl font-bold text-emerald-600">${research.revenue_min.toLocaleString()}</span>
            <span className="text-gray-400 mx-1">–</span>
            <span className="text-2xl font-bold text-emerald-600">${research.revenue_max.toLocaleString()}</span>
            <span className="text-gray-400 text-sm ml-1">/mo</span>
          </div>
          <p className="text-xs text-gray-500">Suggested price: <span className="text-gray-900 font-semibold">${research.suggested_pricing}/mo</span></p>
        </div>
        <div className="rounded-xl border-2 border-gray-300 bg-white p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Build Costs</p>
          <div className="space-y-1 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Initial</span>
              <span className="text-gray-900 font-semibold">${research.build_cost_initial.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly</span>
              <span className="text-gray-900 font-semibold">${research.build_cost_monthly.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors */}
      {research.competitors?.length > 0 && (
        <div className="rounded-xl border-2 border-gray-300 bg-white p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Competitors</p>
          <ul className="divide-y divide-gray-200">
            {research.competitors.map((c) => (
              <li key={c.name} className="flex items-center justify-between py-2.5 gap-3">
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-gray-400 hover:text-indigo-500 transition-colors truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.url}
                  </a>
                </div>
                <span className="flex-none text-xs font-mono text-amber-600">{c.pricing}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {research.skills_required?.length > 0 && (
        <div className="rounded-xl border-2 border-gray-300 bg-white p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Skills Required</p>
          <div className="flex flex-wrap gap-2">
            {research.skills_required.map((s) => (
              <span key={s} className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions */}
      <div className="rounded-xl border-2 border-gray-300 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Assumptions</p>
        <p className="text-xs text-gray-500 leading-relaxed">{research.assumptions}</p>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [research, setResearch] = useState<AIResearch | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("sdpp_projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setLoadError("Project not found.");
        else setProject(data);
      });

    supabase
      .from("ai_research")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setResearch(data as unknown as AIResearch);
      });
  }, [id]);

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">{loadError}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  const color = passionColor(project.passion_level);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back + Edit */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← Back
        </Link>
        <Link
          href={`/dashboard/edit/${project.id}`}
          className="rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-all"
        >
          Edit
        </Link>
      </div>

      {/* Project header card */}
      <div className="rounded-2xl border-2 border-gray-300 bg-white overflow-hidden mb-8">
        <div className="flex">
          <div className="w-1.5 self-stretch flex-none" style={{ backgroundColor: color }} />
          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h1 className="text-2xl font-extrabold text-gray-900">{project.name}</h1>
              <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${alignmentStyle[project.goal_alignment]}`}>
                {project.goal_alignment}
              </span>
              {project.is_started && (
                <span className="rounded-md border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                  {project.completion_percentage}% done
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{project.description}</p>

            {project.learning_goals?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.learning_goals.map((g) => (
                  <span key={g} className="rounded-lg border border-indigo-300 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {project.constraints && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Constraints: </span>{project.constraints}
              </p>
            )}
          </div>

          {/* Passion */}
          <div className="flex-none flex flex-col items-end justify-center p-5">
            <div className="font-mono text-3xl font-bold leading-none" style={{ color }}>
              {project.passion_level}
              <span className="text-gray-400 text-sm font-normal">/10</span>
            </div>
            <div className="text-2xl mt-1">{passionEmoji(project.passion_level)}</div>
          </div>
        </div>
      </div>

      {/* AI Research Button */}
      <AIResearchButton
        projectId={project.id}
        onComplete={(data) => setResearch(data as unknown as AIResearch)}
      />

      {/* Research results */}
      {research && <ResearchPanel research={research} />}
    </div>
  );
}
