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
  goal_alignment: "high" | "medium" | "low";
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
  high:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  medium: "border-amber/30 bg-amber/10 text-amber",
  low:    "border-muted/30 bg-muted/10 text-muted",
};

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
    score >= 5 ? "text-amber border-amber/30 bg-amber/10" :
                 "text-muted border-rim bg-rim/10";
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${color}`}>
      <div className="font-mono text-2xl font-bold">{score}<span className="text-sm font-normal opacity-60">/10</span></div>
      <div className="text-xs font-semibold uppercase tracking-widest mt-0.5 opacity-70">{label}</div>
    </div>
  );
}

function ResearchPanel({ research }: { research: AIResearch }) {
  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted">AI Research</h2>

      {/* Scores row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ScoreBadge label="Demand" score={research.demand_score} />
        <ScoreBadge label="Audience Size" score={research.audience_size_score} />
        <ScoreBadge label="Reachability" score={research.accessibility_score} />
        <div className="rounded-xl border border-glow/30 bg-glow/10 px-4 py-3 text-center">
          <div className="font-mono text-2xl font-bold text-glow">{research.time_to_build_weeks}<span className="text-sm font-normal opacity-60">w</span></div>
          <div className="text-xs font-semibold uppercase tracking-widest mt-0.5 text-glow/70">Build Time</div>
        </div>
      </div>

      {/* USP */}
      <div className="rounded-xl border border-rim bg-card p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Unique Angle</p>
        <p className="text-sm text-cream leading-relaxed">{research.unique_selling_point}</p>
      </div>

      {/* Revenue + Costs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-rim bg-card p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Revenue Estimate</p>
          <div className="font-mono text-cream">
            <span className="text-2xl font-bold text-emerald-400">${research.revenue_min.toLocaleString()}</span>
            <span className="text-muted mx-1">–</span>
            <span className="text-2xl font-bold text-emerald-400">${research.revenue_max.toLocaleString()}</span>
            <span className="text-muted text-sm ml-1">/mo</span>
          </div>
          <p className="text-xs text-muted">Suggested price: <span className="text-cream font-semibold">${research.suggested_pricing}/mo</span></p>
        </div>
        <div className="rounded-xl border border-rim bg-card p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Build Costs</p>
          <div className="space-y-1 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Initial</span>
              <span className="text-cream font-semibold">${research.build_cost_initial.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Monthly</span>
              <span className="text-cream font-semibold">${research.build_cost_monthly.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors */}
      {research.competitors.length > 0 && (
        <div className="rounded-xl border border-rim bg-card p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Competitors</p>
          <ul className="divide-y divide-rim">
            {research.competitors.map((c) => (
              <li key={c.name} className="flex items-center justify-between py-2.5 gap-3">
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-cream">{c.name}</span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-muted hover:text-glow transition-colors truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.url}
                  </a>
                </div>
                <span className="flex-none text-xs font-mono text-amber">{c.pricing}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {research.skills_required.length > 0 && (
        <div className="rounded-xl border border-rim bg-card p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Skills Required</p>
          <div className="flex flex-wrap gap-2">
            {research.skills_required.map((s) => (
              <span key={s} className="rounded-lg border border-glow/30 bg-glow/10 px-3 py-1.5 text-sm font-medium text-glow">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions */}
      <div className="rounded-xl border border-rim bg-card p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Assumptions</p>
        <p className="text-xs text-muted leading-relaxed">{research.assumptions}</p>
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
    // Fetch project
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setLoadError("Project not found.");
        else setProject(data);
      });

    // Fetch existing research if any
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
        <p className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">{loadError}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-rim rounded-lg w-1/3" />
        <div className="h-4 bg-rim rounded w-2/3" />
        <div className="h-32 bg-rim rounded-2xl" />
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
          className="text-xs font-mono uppercase tracking-widest text-muted hover:text-cream transition-colors"
        >
          ← Back
        </Link>
        <Link
          href={`/dashboard/edit/${project.id}`}
          className="rounded-lg border border-rim bg-surface px-3 py-1.5 text-xs font-semibold text-cream hover:border-amber hover:text-amber transition-all"
        >
          Edit
        </Link>
      </div>

      {/* Project header card */}
      <div className="rounded-2xl border border-rim bg-card overflow-hidden mb-8">
        <div className="flex">
          <div className="w-1.5 self-stretch flex-none" style={{ backgroundColor: color }} />
          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h1 className="text-2xl font-extrabold text-cream">{project.name}</h1>
              <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${alignmentStyle[project.goal_alignment]}`}>
                {project.goal_alignment}
              </span>
              {project.is_started && (
                <span className="rounded-md border border-glow/30 bg-glow/10 px-2 py-0.5 text-xs font-semibold text-glow">
                  {project.completion_percentage}% done
                </span>
              )}
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">{project.description}</p>

            {project.learning_goals?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.learning_goals.map((g) => (
                  <span key={g} className="rounded-lg border border-glow/30 bg-glow/10 px-2.5 py-1 text-xs font-medium text-glow">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {project.constraints && (
              <p className="text-xs text-muted">
                <span className="font-semibold text-cream">Constraints: </span>{project.constraints}
              </p>
            )}
          </div>

          {/* Passion */}
          <div className="flex-none flex flex-col items-end justify-center p-5">
            <div className="font-mono text-3xl font-bold leading-none" style={{ color }}>
              {project.passion_level}
              <span className="text-muted text-sm font-normal">/10</span>
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
