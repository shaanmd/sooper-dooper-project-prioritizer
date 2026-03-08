"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  Label,
} from "recharts";

export interface BubbleDataPoint {
  id: string;
  name: string;
  value_score: number;
  effort_score: number;
  net_profit: number;
  passion_level: number;
}

function passionColor(level: number): string {
  if (level <= 2) return "#94A3B8"; // slate
  if (level <= 4) return "#818CF8"; // indigo
  if (level <= 6) return "#38BDF8"; // sky
  if (level <= 8) return "#F5A623"; // amber
  if (level <= 9) return "#F97316"; // orange
  return "#F43F5E";                 // rose
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as BubbleDataPoint;
  const color = passionColor(d.passion_level);
  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white/95 backdrop-blur-sm px-4 py-3.5 shadow-xl shadow-gray-300/60 min-w-[200px] relative z-[9999]" style={{ isolation: "isolate" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ backgroundColor: color }} />
        <p className="font-bold text-gray-900 text-sm line-clamp-2">{d.name}</p>
      </div>
      <div className="space-y-1.5">
        {[
          { label: "Value",       value: `${d.value_score.toFixed(1)} / 10`,  color: "#10B981" },
          { label: "Effort",      value: `${d.effort_score.toFixed(1)} / 10`, color: "#818CF8" },
          { label: "Est. Profit", value: `$${d.net_profit.toLocaleString()}`,  color: "#F5A623" },
          { label: "Passion",     value: `${d.passion_level} / 10`,           color },
        ].map(({ label, value, color: c }) => (
          <div key={label} className="flex justify-between gap-6 text-xs">
            <span className="text-gray-500">{label}</span>
            <span className="font-mono font-semibold" style={{ color: c }}>{value}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">
        Click to view details →
      </p>
    </div>
  );
};

export default function BubbleChart({ data, winnerId }: { data: BubbleDataPoint[]; winnerId?: string }) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const maxProfit = Math.max(...data.map((d) => Math.max(0, d.net_profit)), 1);

  const renderBubble = (props: any) => {
    const { cx, cy, payload } = props as { cx: number; cy: number; payload: BubbleDataPoint };
    const r = 14 + 30 * Math.sqrt(Math.max(0, payload.net_profit) / maxProfit);
    const color = passionColor(payload.passion_level);
    const shortName = payload.name.length > 18 ? payload.name.slice(0, 18) + "…" : payload.name;
    const isWinner = payload.id === winnerId;
    const isHovered = payload.id === hoveredId;

    return (
      <g
        onClick={() => router.push(`/dashboard/${payload.id}`)}
        onMouseEnter={() => setHoveredId(payload.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          cursor: "pointer",
          transformOrigin: `${cx}px ${cy}px`,
          transform: isHovered ? "scale(1.13)" : "scale(1)",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease",
          filter: isHovered
            ? `drop-shadow(0 8px 20px ${color}55)`
            : isWinner
              ? `drop-shadow(0 4px 10px ${color}44)`
              : "drop-shadow(0 2px 6px rgba(0,0,0,0.1))",
        }}
      >
        {/* Animated pulse ring for winner */}
        {isWinner && (
          <>
            <circle
              cx={cx} cy={cy} r={r + 14}
              fill="none"
              stroke="#F5A623"
              strokeWidth={2}
              strokeDasharray="8 4"
              strokeOpacity={0.5}
            />
            <circle
              cx={cx} cy={cy} r={r + 10}
              fill="#F5A623"
              fillOpacity={0.08}
            />
          </>
        )}

        {/* Outer glow halo */}
        <circle cx={cx} cy={cy} r={r + 6} fill={color} fillOpacity={isHovered ? 0.2 : 0.12} />

        {/* Main bubble */}
        <circle
          cx={cx} cy={cy} r={r}
          fill={color}
          fillOpacity={isHovered ? 0.95 : 0.88}
          stroke={isWinner ? "#F5A623" : "rgba(255,255,255,0.9)"}
          strokeWidth={isWinner ? 3 : 2.5}
        />

        {/* Inner specular highlight for 3D feel */}
        <circle
          cx={cx - r * 0.28} cy={cy - r * 0.28}
          r={r * 0.38}
          fill="rgba(255,255,255,0.35)"
        />

        {/* Label with background for readability */}
        {r >= 22 && (
          <>
            {/* Text background */}
            <rect
              x={cx - r * 0.85}
              y={cy - 6}
              width={r * 1.7}
              height={12}
              rx={6}
              fill="rgba(0,0,0,0.45)"
            />
            {/* Text */}
            <text
              x={cx} y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={Math.min(11, r * 0.4)}
              fontWeight={700}
              fontFamily="system-ui, -apple-system, sans-serif"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {shortName}
            </text>
          </>
        )}

        {/* Hover name for small bubbles */}
        {isHovered && r < 22 && (
          <>
            <rect
              x={cx - 50}
              y={cy - r - 28}
              width={100}
              height={16}
              rx={8}
              fill="white"
              fillOpacity={0.95}
              stroke={color}
              strokeWidth={1.5}
            />
            <text
              x={cx} y={cy - r - 20}
              textAnchor="middle"
              fill={color}
              fontSize={10}
              fontWeight={700}
              fontFamily="system-ui, -apple-system, sans-serif"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {shortName}
            </text>
          </>
        )}

        {/* Winner trophy */}
        {isWinner && (
          <text
            x={cx} y={cy - r - 18}
            textAnchor="middle"
            fontSize={18}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            🏆
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-3">
      {/* Mobile Scroll Hint */}
      <div className="md:hidden px-4 py-2 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
        <p className="text-xs text-amber-700 font-semibold">← Swipe to see full chart →</p>
      </div>

      {/* Chart Container */}
      <div
        className="w-full overflow-x-auto rounded-2xl border-2 border-gray-300 bg-white p-3 md:p-4 relative shadow-sm"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="min-w-[600px] h-[480px] relative">

          {/* Quadrant labels with backgrounds - Deb's names! */}
          <div className="absolute inset-0 pointer-events-none select-none z-10" aria-hidden>
            {/* Top-left: The Dream */}
            <div className="absolute top-8 left-16 w-24 h-12 md:w-32 md:h-16 flex flex-col items-center justify-center rounded-lg bg-emerald-50/80 backdrop-blur-sm border-2 border-emerald-300/60">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">The Dream</p>
              <p className="text-[7px] md:text-[8px] text-emerald-500/70 mt-0.5">High value, low effort</p>
            </div>

            {/* Top-right: The Commitment */}
            <div className="absolute top-8 right-16 w-24 h-12 md:w-32 md:h-16 flex flex-col items-center justify-center rounded-lg bg-amber-50/80 backdrop-blur-sm border-2 border-amber-300/60">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-amber-600">The Commitment</p>
              <p className="text-[7px] md:text-[8px] text-amber-500/70 mt-0.5">High value, high effort</p>
            </div>

            {/* Bottom-left: The Distraction */}
            <div className="absolute bottom-20 left-16 w-24 h-12 md:w-32 md:h-16 flex flex-col items-center justify-center rounded-lg bg-gray-50/80 backdrop-blur-sm border-2 border-gray-400/60">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">The Distraction</p>
              <p className="text-[7px] md:text-[8px] text-gray-400/70 mt-0.5">Low value, low effort</p>
            </div>

            {/* Bottom-right: The Trap */}
            <div className="absolute bottom-20 right-16 w-24 h-12 md:w-32 md:h-16 flex flex-col items-center justify-center rounded-lg bg-rose-50/80 backdrop-blur-sm border-2 border-rose-300/60">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-rose-600">The Trap</p>
              <p className="text-[7px] md:text-[8px] text-rose-500/70 mt-0.5">Low value, high effort</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 30, right: 50, bottom: 50, left: 10 }}>
              {/* Quadrant shading */}
              <ReferenceArea x1={0} x2={5} y1={5} y2={10} fill="rgba(16,185,129,0.05)"  strokeOpacity={0} />
              <ReferenceArea x1={5} x2={10} y1={5} y2={10} fill="rgba(245,158,11,0.05)" strokeOpacity={0} />
              <ReferenceArea x1={0} x2={5} y1={0} y2={5}  fill="rgba(156,163,175,0.03)" strokeOpacity={0} />
              <ReferenceArea x1={5} x2={10} y1={0} y2={5}  fill="rgba(239,68,68,0.04)"  strokeOpacity={0} />

              {/* Quadrant dividers */}
              <ReferenceLine x={5} stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} strokeDasharray="6 4" />
              <ReferenceLine y={5} stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} strokeDasharray="6 4" />

              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />

              <XAxis
                type="number"
                dataKey="effort_score"
                domain={[0, 10]}
                tickCount={6}
                tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 500, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(0,0,0,0.15)", strokeWidth: 1.5 }}
                tickLine={{ stroke: "rgba(0,0,0,0.15)", strokeWidth: 1.5 }}
              >
                <Label
                  value="Effort →"
                  position="insideBottom"
                  offset={-14}
                  fill="rgba(0,0,0,0.5)"
                  fontSize={18}
                  fontWeight={600}
                  fontFamily="system-ui"
                />
              </XAxis>

              <YAxis
                type="number"
                dataKey="value_score"
                domain={[0, 10]}
                tickCount={6}
                width={40}
                tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 500, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(0,0,0,0.15)", strokeWidth: 1.5 }}
                tickLine={{ stroke: "rgba(0,0,0,0.15)", strokeWidth: 1.5 }}
              >
                <Label
                  value="Value ↑"
                  angle={0}
                  position="top"
                  offset={18}
                  fill="rgba(0,0,0,0.5)"
                  fontSize={18}
                  fontWeight={600}
                  fontFamily="system-ui"
                />
              </YAxis>

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: "3 3", stroke: "rgba(0,0,0,0.08)" }}
              />

              <Scatter
                data={data}
                shape={renderBubble}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
