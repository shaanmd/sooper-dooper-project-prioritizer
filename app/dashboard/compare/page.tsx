"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BubbleChart, { BubbleDataPoint } from "@/components/BubbleChart";

interface ProjectRow {
  id: string;
  name: string;
  passion_level: number;
  goal_alignment: string;
  learning_goals: string[] | null;
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

interface RawProject {
  project: ProjectRow;
  research: ResearchRow | null;
}

type RiskTolerance = "Low" | "Medium" | "High";

const DEFAULTS = {
  profitSlider: 50,
  riskTolerance: "Medium" as RiskTolerance,
  passionThreshold: 5,
};

function passionColor(level: number): string {
  if (level <= 2) return "#94A3B8";
  if (level <= 4) return "#818CF8";
  if (level <= 6) return "#38BDF8";
  if (level <= 8) return "#F5A623";
  if (level <= 9) return "#F97316";
  return "#F43F5E";
}

const PASSION_LEVELS = [1, 3, 5, 7, 9, 10];

function computeMetrics(
  raw: RawProject[],
  profitSlider: number,
  riskTolerance: RiskTolerance,
): Map<string, Metrics> {
  const profitWeight = profitSlider / 100;
  const learningWeight = 1 - profitWeight;

  const rawNetProfits: number[] = [];
  for (const { research: r } of raw) {
    if (!r) continue;
    rawNetProfits.push(
      Math.round(r.suggested_pricing * 20 * 12 - r.build_cost_initial - r.build_cost_monthly * 12),
    );
  }
  const maxNetProfit = Math.max(1, ...rawNetProfits);

  const effortWeight = riskTolerance === "Low" ? 0.5 : riskTolerance === "Medium" ? 0.3 : 0.1;

  const result = new Map<string, Metrics>();
  for (const { project, research: r } of raw) {
    if (!r) continue;

    const base_value = (r.demand_score + r.audience_size_score + r.accessibility_score) / 3;
    const effort_score = parseFloat(Math.min(10, (r.time_to_build_weeks * 10) / 16).toFixed(1));
    const net_profit = Math.round(
      r.suggested_pricing * 20 * 12 - r.build_cost_initial - r.build_cost_monthly * 12,
    );

    const profitNorm = Math.min(10, Math.max(0, (net_profit / maxNetProfit) * 10));
    const learningNorm = Math.min(10, (project.learning_goals?.length ?? 0) * 2.5);

    // value_score: base AI signal * 0.5 + profit/learning blend * 0.5 → stays 0–10
    const value_score = parseFloat(
      (base_value * 0.5 + (profitNorm * profitWeight + learningNorm * learningWeight) * 0.5).toFixed(1),
    );

    // rank_score weights: Low 0.4/0.5/0.1 · Medium 0.6/0.3/0.1 · High 0.8/0.1/0.1
    const rank_score = parseFloat(
      (
        value_score * (0.9 - effortWeight) +
        (10 - effort_score) * effortWeight +
        project.passion_level * 0.1
      ).toFixed(2),
    );

    result.set(project.id, { value_score, effort_score, net_profit, rank_score });
  }
  return result;
}

export default function ComparePage() {
  const [rawProjects, setRawProjects] = useState<RawProject[]>([]);
  const [loading, setLoading] = useState(true);

  const [profitSlider, setProfitSlider] = useState(DEFAULTS.profitSlider);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(DEFAULTS.riskTolerance);
  const [passionThreshold, setPassionThreshold] = useState(DEFAULTS.passionThreshold);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const [{ data: projects }, { data: research }] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, passion_level, goal_alignment, learning_goals")
          .order("created_at", { ascending: false }),
        supabase
          .from("ai_research")
          .select(
            "project_id, demand_score, audience_size_score, accessibility_score, suggested_pricing, build_cost_initial, build_cost_monthly, time_to_build_weeks, created_at",
          )
          .order("created_at", { ascending: false }),
      ]);

      const researchMap: Record<string, ResearchRow> = {};
      for (const r of research ?? []) {
        if (!researchMap[r.project_id]) researchMap[r.project_id] = r;
      }

      setRawProjects(
        (projects ?? []).map((project) => ({
          project,
          research: researchMap[project.id] ?? null,
        })),
      );
      setLoading(false);
    }
    load();
  }, []);

  const metricsMap = useMemo(
    () => computeMetrics(rawProjects, profitSlider, riskTolerance),
    [rawProjects, profitSlider, riskTolerance],
  );

  const enriched = useMemo(() => {
    return rawProjects
      .filter(({ project }) => project.passion_level >= passionThreshold)
      .map(({ project, research }) => ({
        project,
        research,
        metrics: metricsMap.get(project.id) ?? null,
      }))
      .sort((a, b) => {
        if (!a.metrics && !b.metrics) return 0;
        if (!a.metrics) return 1;
        if (!b.metrics) return -1;
        return b.metrics.rank_score - a.metrics.rank_score;
      });
  }, [rawProjects, metricsMap, passionThreshold]);

  const ranked = enriched.filter((e) => e.metrics);
  const unanalysed = enriched.filter((e) => !e.metrics);
  const winnerId = ranked[0]?.project.id;
  const hasAnyResearch = rawProjects.some((r) => r.research !== null);

  const bubbleData: BubbleDataPoint[] = ranked
    .filter((e) => !hiddenIds.has(e.project.id))
    .map((e) => ({
      id: e.project.id,
      name: e.project.name,
      value_score: e.metrics!.value_score,
      effort_score: e.metrics!.effort_score,
      net_profit: e.metrics!.net_profit,
      passion_level: e.project.passion_level,
    }));

  function toggleVisibility(id: string) {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const isDefault =
    profitSlider === DEFAULTS.profitSlider &&
    riskTolerance === DEFAULTS.riskTolerance &&
    passionThreshold === DEFAULTS.passionThreshold;

  function resetDefaults() {
    setProfitSlider(DEFAULTS.profitSlider);
    setRiskTolerance(DEFAULTS.riskTolerance);
    setPassionThreshold(DEFAULTS.passionThreshold);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Visualize</p>
        <h1 className="text-3xl font-extrabold text-gray-900">Project Prioritizer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Top-left bubbles are your winners — high value, low effort.
        </p>
      </div>

      {loading ? (
        <div className="h-[460px] rounded-2xl border border-gray-200 bg-gray-100 animate-pulse" />
      ) : !hasAnyResearch ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-gray-200 bg-white text-center shadow-sm">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-900 font-semibold mb-1">No analysis data yet</p>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
            Run AI Research on your projects first, then come back here to compare them visually.
          </p>
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-3 text-sm font-bold text-white hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] hover:scale-[1.02] transition-all"
          >
            Go to Projects
          </Link>
        </div>
      ) : (
        <>
          <BubbleChart data={bubbleData} winnerId={winnerId} />

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400 justify-end pr-1">
            <span>Bubble size = estimated year-1 profit</span>
            <span className="flex items-center gap-1.5">
              Color = passion level
              <span className="flex gap-0.5 items-center">
                {PASSION_LEVELS.map((l) => (
                  <span
                    key={l}
                    className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-black/5"
                    style={{ backgroundColor: passionColor(l) }}
                  />
                ))}
              </span>
            </span>
          </div>

          {/* ── Controls ── */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Adjust Priorities
                </h2>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Rankings and chart update in real-time
                </p>
              </div>
              <button
                onClick={resetDefaults}
                disabled={isDefault}
                className={[
                  "text-xs font-semibold border rounded-lg px-3 py-1.5 transition-all",
                  isDefault
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-500 hover:text-amber-600 border-gray-200 hover:border-amber-300 cursor-pointer",
                ].join(" ")}
              >
                Reset to Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profit vs Learning */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-gray-700">Profit vs Learning</span>
                  <span className="text-xs font-mono font-bold text-amber-500">{profitSlider}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={profitSlider}
                  onChange={(e) => setProfitSlider(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#F5A623" }}
                />
                <div className="flex justify-between text-[10px] text-gray-300 font-mono">
                  <span>Only Learning</span>
                  <span>Only Profit</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed pt-0.5">
                  {profitSlider < 30
                    ? "Learning goals are driving your value score"
                    : profitSlider > 70
                      ? "Revenue potential dominates the score"
                      : "Balancing profit potential and learning goals"}
                </p>
              </div>

              {/* Risk Tolerance */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 block">Risk Tolerance</span>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as RiskTolerance[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setRiskTolerance(level)}
                      className={[
                        "flex-1 rounded-lg border py-2 text-xs font-semibold transition-all",
                        riskTolerance === level
                          ? "border-amber-300 bg-amber-50 text-amber-600"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900",
                      ].join(" ")}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed pt-0.5">
                  {riskTolerance === "Low" && "High-effort projects are penalized heavily"}
                  {riskTolerance === "Medium" && "Effort is weighted neutrally on rankings"}
                  {riskTolerance === "High" && "Big efforts for big rewards — go for it"}
                </p>
              </div>

              {/* Passion Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-gray-700">Passion Threshold</span>
                  <span className="text-xs font-mono font-bold text-amber-500">{passionThreshold}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={passionThreshold}
                  onChange={(e) => setPassionThreshold(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#F5A623" }}
                />
                <div className="flex justify-between text-[10px] text-gray-300 font-mono">
                  <span>Show all</span>
                  <span>Max only</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed pt-0.5">
                  {passionThreshold <= 3
                    ? "Showing all projects regardless of passion"
                    : passionThreshold <= 6
                      ? "Only projects you care about moderately or more"
                      : "Only your most exciting projects make the cut"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Rankings ── */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Rankings</h2>
              <span className="text-[10px] text-gray-300 font-mono">Checkbox = show in chart</span>
            </div>

            {ranked.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-10 text-center">
                <p className="text-gray-500 text-sm mb-3">
                  No analysed projects match your passion threshold of {passionThreshold}/10.
                </p>
                <button
                  onClick={() => setPassionThreshold(1)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Lower threshold to show all →
                </button>
              </div>
            ) : (
              <ol className="space-y-2">
                {ranked.map(({ project, metrics }, i) => (
                  <li key={project.id} className="flex items-center gap-3">
                    {/* Chart visibility toggle */}
                    <button
                      onClick={() => toggleVisibility(project.id)}
                      title={hiddenIds.has(project.id) ? "Show in chart" : "Hide from chart"}
                      className={[
                        "flex-none w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150",
                        hiddenIds.has(project.id)
                          ? "border-gray-300 bg-white"
                          : "border-amber-400 bg-amber-400",
                      ].join(" ")}
                    >
                      {!hiddenIds.has(project.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <Link
                      href={`/dashboard/${project.id}`}
                      className={[
                        "group flex-1 flex items-center gap-4 rounded-xl border px-5 py-4 hover:-translate-y-0.5 transition-all duration-200",
                        hiddenIds.has(project.id) ? "opacity-40" : "",
                        i === 0
                          ? "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:shadow-[0_4px_24px_rgba(245,166,35,0.12)]"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                      ].join(" ")}
                    >
                      {/* Rank */}
                      <span
                        className={[
                          "font-mono text-xl font-black w-7 text-right flex-none tabular-nums",
                          i === 0
                            ? "text-amber-500"
                            : i === 1
                              ? "text-gray-400"
                              : i === 2
                                ? "text-amber-300"
                                : "text-gray-200",
                        ].join(" ")}
                      >
                        {i + 1}
                      </span>

                      {/* Passion dot */}
                      <span
                        className="w-3 h-3 rounded-full flex-none ring-1 ring-black/5"
                        style={{ backgroundColor: passionColor(project.passion_level) }}
                      />

                      {/* Name + winner badge */}
                      <span className="flex-1 min-w-0 font-semibold text-gray-900 group-hover:text-amber-600 transition-colors flex items-center gap-2 truncate">
                        <span className="truncate">{project.name}</span>
                        {i === 0 && (
                          <span className="flex-none rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 tracking-wide whitespace-nowrap">
                            🏆 Winner
                          </span>
                        )}
                      </span>

                      {/* Metrics */}
                      <div className="flex gap-4 flex-none text-xs font-mono">
                        <div className="text-right hidden sm:block">
                          <div className="text-amber-500 font-bold">{metrics!.value_score.toFixed(1)}</div>
                          <div className="text-gray-300 text-[10px]">value</div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="text-indigo-500 font-bold">{metrics!.effort_score.toFixed(1)}</div>
                          <div className="text-gray-300 text-[10px]">effort</div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div
                            className={`font-bold ${
                              metrics!.net_profit >= 0 ? "text-emerald-600" : "text-rose-500"
                            }`}
                          >
                            {metrics!.net_profit >= 0 ? "+" : "−"}$
                            {Math.abs(metrics!.net_profit).toLocaleString()}
                          </div>
                          <div className="text-gray-300 text-[10px]">est. profit</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-700 font-bold">{metrics!.rank_score.toFixed(1)}</div>
                          <div className="text-gray-300 text-[10px]">score</div>
                        </div>
                      </div>

                      <span className="text-gray-200 group-hover:text-gray-400 transition-colors flex-none">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            {/* Unanalysed projects */}
            {unanalysed.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">
                  Awaiting Analysis
                </p>
                <ul className="space-y-2">
                  {unanalysed.map(({ project }) => (
                    <li key={project.id}>
                      <Link
                        href={`/dashboard/${project.id}`}
                        className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 opacity-60 hover:opacity-90 transition-opacity"
                      >
                        <span className="w-3 h-3 rounded-full flex-none bg-gray-300" />
                        <span className="flex-1 text-gray-400 font-medium truncate">{project.name}</span>
                        <span className="text-xs text-gray-300 font-mono">Run AI Research →</span>
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
