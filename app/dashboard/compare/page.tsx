"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BubbleChart, { BubbleDataPoint } from "@/components/BubbleChart";

interface ProjectRow {
  id: string;
  name: string;
  passion_level: number;
  goal_alignment: string;
}

interface ResearchRow {
  project_id: string;
  demand_score: number;
  audience_size_score: number;
  accessibility_score: number;
  suggested_pricing: number;
  build_cost_initial: number;
  build_cost_monthly: number;
  time_to_build_weeks: number;
}

interface Metrics {
  value_score: number;
  effort_score: number;
  net_profit: number;
  rank_score: number;
}

interface EnrichedProject {
  project: ProjectRow;
  metrics: Metrics | null;
}

function deriveMetrics(r: ResearchRow, passion_level: number): Metrics {
  const value_score = parseFloat(
    ((r.demand_score + r.audience_size_score + r.accessibility_score) / 3).toFixed(1)
  );
  // Normalize: 16 weeks → effort 10
  const effort_score = parseFloat(Math.min(10, (r.time_to_build_weeks * 10) / 16).toFixed(1));
  // Estimate: 20 paying customers over year 1
  const net_profit = Math.round(
    r.suggested_pricing * 20 * 12 - r.build_cost_initial - r.build_cost_monthly * 12
  );
  // Composite: value weighted highest, easy projects rewarded, passion as tiebreaker
  const rank_score = parseFloat(
    (value_score * 0.5 + (10 - effort_score) * 0.3 + passion_level * 0.2).toFixed(2)
  );
  return { value_score, effort_score, net_profit, rank_score };
}

function passionColor(level: number): string {
  if (level <= 2) return "#7775A6";
  if (level <= 4) return "#818CF8";
  if (level <= 6) return "#60A5FA";
  if (level <= 8) return "#F5A623";
  if (level <= 9) return "#F97316";
  return "#F43F5E";
}

const PASSION_LEVELS = [1, 3, 5, 7, 9, 10];

export default function ComparePage() {
  const [enriched, setEnriched] = useState<EnrichedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: projects }, { data: research }] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, passion_level, goal_alignment")
          .order("created_at", { ascending: false }),
        supabase
          .from("ai_research")
          .select(
            "project_id, demand_score, audience_size_score, accessibility_score, suggested_pricing, build_cost_initial, build_cost_monthly, time_to_build_weeks, created_at"
          )
          .order("created_at", { ascending: false }),
      ]);

      // Keep only the most-recent research row per project
      const researchMap: Record<string, ResearchRow> = {};
      for (const r of research ?? []) {
        if (!researchMap[r.project_id]) researchMap[r.project_id] = r;
      }

      const result: EnrichedProject[] = (projects ?? []).map((project) => {
        const r = researchMap[project.id] ?? null;
        return { project, metrics: r ? deriveMetrics(r, project.passion_level) : null };
      });

      result.sort((a, b) => {
        if (!a.metrics && !b.metrics) return 0;
        if (!a.metrics) return 1;
        if (!b.metrics) return -1;
        return b.metrics.rank_score - a.metrics.rank_score;
      });

      setEnriched(result);
      setLoading(false);
    }
    load();
  }, []);

  const bubbleData: BubbleDataPoint[] = enriched
    .filter((e) => e.metrics)
    .map((e) => ({
      id: e.project.id,
      name: e.project.name,
      value_score: e.metrics!.value_score,
      effort_score: e.metrics!.effort_score,
      net_profit: e.metrics!.net_profit,
      passion_level: e.project.passion_level,
    }));

  const ranked = enriched.filter((e) => e.metrics);
  const unanalysed = enriched.filter((e) => !e.metrics);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Visualize</p>
        <h1 className="text-3xl font-extrabold text-cream">Project Prioritizer</h1>
        <p className="mt-1 text-sm text-muted">
          Top-left bubbles are your winners — high value, low effort.
        </p>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-[460px] rounded-2xl border border-rim bg-card animate-pulse" />
      ) : bubbleData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-rim bg-card text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-cream font-semibold mb-1">No analysis data yet</p>
          <p className="text-muted text-sm max-w-xs leading-relaxed mb-8">
            Run AI Research on your projects first, then come back here to compare them visually.
          </p>
          <Link
            href="/dashboard"
            className="rounded-xl bg-amber px-6 py-3 text-sm font-bold text-ink hover:bg-amber/90 transition-colors"
          >
            Go to Projects
          </Link>
        </div>
      ) : (
        <>
          <BubbleChart data={bubbleData} />

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted/60 justify-end pr-1">
            <span>Bubble size = estimated year-1 profit</span>
            <span className="flex items-center gap-1.5">
              Color = passion level
              <span className="flex gap-0.5 items-center">
                {PASSION_LEVELS.map((l) => (
                  <span
                    key={l}
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: passionColor(l) }}
                  />
                ))}
              </span>
            </span>
          </div>

          {/* Rankings */}
          <div className="mt-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">Rankings</h2>
            <ol className="space-y-2">
              {ranked.map(({ project, metrics }, i) => (
                <li key={project.id}>
                  <Link
                    href={`/dashboard/${project.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-rim bg-card px-5 py-4 hover:border-muted/50 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200"
                  >
                    {/* Rank */}
                    <span
                      className={[
                        "font-mono text-xl font-black w-7 text-right flex-none tabular-nums",
                        i === 0
                          ? "text-amber"
                          : i === 1
                          ? "text-muted/60"
                          : i === 2
                          ? "text-amber/40"
                          : "text-muted/30",
                      ].join(" ")}
                    >
                      {i + 1}
                    </span>

                    {/* Passion dot */}
                    <span
                      className="w-3 h-3 rounded-full flex-none ring-1 ring-white/10"
                      style={{ backgroundColor: passionColor(project.passion_level) }}
                    />

                    {/* Name */}
                    <span className="flex-1 font-semibold text-cream group-hover:text-amber transition-colors truncate">
                      {project.name}
                    </span>

                    {/* Metrics */}
                    <div className="flex gap-4 flex-none text-xs font-mono">
                      <div className="text-right hidden sm:block">
                        <div className="text-amber font-bold">{metrics!.value_score.toFixed(1)}</div>
                        <div className="text-muted/50 text-[10px]">value</div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-glow font-bold">{metrics!.effort_score.toFixed(1)}</div>
                        <div className="text-muted/50 text-[10px]">effort</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div
                          className={`font-bold ${
                            metrics!.net_profit >= 0 ? "text-emerald-400" : "text-rose"
                          }`}
                        >
                          {metrics!.net_profit >= 0 ? "+" : "−"}$
                          {Math.abs(metrics!.net_profit).toLocaleString()}
                        </div>
                        <div className="text-muted/50 text-[10px]">est. profit</div>
                      </div>
                      <div className="text-right">
                        <div className="text-cream font-bold">{metrics!.rank_score.toFixed(1)}</div>
                        <div className="text-muted/50 text-[10px]">score</div>
                      </div>
                    </div>

                    <span className="text-muted/25 group-hover:text-muted/60 transition-colors flex-none">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            {/* Unanalysed projects */}
            {unanalysed.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted/40 mb-3">
                  Awaiting Analysis
                </p>
                <ul className="space-y-2">
                  {unanalysed.map(({ project }) => (
                    <li key={project.id}>
                      <Link
                        href={`/dashboard/${project.id}`}
                        className="flex items-center gap-4 rounded-xl border border-rim/40 bg-card/40 px-5 py-3 opacity-50 hover:opacity-80 transition-opacity"
                      >
                        <span className="w-3 h-3 rounded-full flex-none bg-muted/20" />
                        <span className="flex-1 text-muted font-medium truncate">{project.name}</span>
                        <span className="text-xs text-muted/40 font-mono">Run AI Research →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
