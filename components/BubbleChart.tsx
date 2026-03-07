"use client";

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
  if (level <= 2) return "#7775A6";
  if (level <= 4) return "#818CF8";
  if (level <= 6) return "#60A5FA";
  if (level <= 8) return "#F5A623";
  if (level <= 9) return "#F97316";
  return "#F43F5E";
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as BubbleDataPoint;
  const color = passionColor(d.passion_level);
  return (
    <div className="rounded-xl border border-rim bg-surface/95 backdrop-blur-sm px-4 py-3 shadow-2xl min-w-[190px]">
      <p className="font-bold text-cream text-sm mb-2.5">{d.name}</p>
      <div className="space-y-1.5">
        {[
          { label: "Value",      value: `${d.value_score.toFixed(1)} / 10`,       color: "#F5A623" },
          { label: "Effort",     value: `${d.effort_score.toFixed(1)} / 10`,      color: "#818CF8" },
          { label: "Est. Profit",value: `$${d.net_profit.toLocaleString()}`,       color: "#4ade80" },
          { label: "Passion",    value: `${d.passion_level} / 10`,                color },
        ].map(({ label, value, color: c }) => (
          <div key={label} className="flex justify-between gap-6 text-xs">
            <span className="text-muted">{label}</span>
            <span className="font-mono font-semibold" style={{ color: c }}>{value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted/40 mt-2.5 pt-2 border-t border-rim">Click to view details →</p>
    </div>
  );
};

export default function BubbleChart({ data }: { data: BubbleDataPoint[] }) {
  const router = useRouter();
  const maxProfit = Math.max(...data.map((d) => Math.max(0, d.net_profit)), 1);

  const renderBubble = (props: any) => {
    const { cx, cy, payload } = props as { cx: number; cy: number; payload: BubbleDataPoint };
    const r = 14 + 30 * Math.sqrt(Math.max(0, payload.net_profit) / maxProfit);
    const color = passionColor(payload.passion_level);
    const shortName = payload.name.length > 12 ? payload.name.slice(0, 12) + "…" : payload.name;

    return (
      <g
        onClick={() => router.push(`/dashboard/${payload.id}`)}
        style={{ cursor: "pointer" }}
      >
        {/* Glow halo */}
        <circle cx={cx} cy={cy} r={r + 6} fill={color} fillOpacity={0.1} />
        {/* Main bubble */}
        <circle
          cx={cx} cy={cy} r={r}
          fill={color}
          fillOpacity={0.88}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.5}
        />
        {/* Label inside bubble */}
        {r >= 22 && (
          <text
            x={cx} y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.92)"
            fontSize={Math.min(11, r * 0.42)}
            fontWeight={700}
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {shortName}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-rim bg-card p-2 sm:p-4 relative">
      {/* Corner quadrant labels — overlaid absolutely */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {/* These are positioned to sit inside the chart plot area visually */}
        <div className="absolute top-6 left-14 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/30">
          Sweet Spot
        </div>
        <div className="absolute top-6 right-8 text-[9px] font-black uppercase tracking-[0.2em] text-amber/30 text-right">
          Major Project
        </div>
        <div className="absolute bottom-16 left-14 text-[9px] font-black uppercase tracking-[0.2em] text-muted/25">
          Fill-in
        </div>
        <div className="absolute bottom-16 right-8 text-[9px] font-black uppercase tracking-[0.2em] text-rose/30 text-right">
          Avoid
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <ScatterChart margin={{ top: 20, right: 28, bottom: 48, left: 20 }}>
          {/* Quadrant shading */}
          <ReferenceArea x1={0} x2={5} y1={5} y2={10} fill="rgba(34,197,94,0.05)"  strokeOpacity={0} />
          <ReferenceArea x1={5} x2={10} y1={5} y2={10} fill="rgba(245,166,35,0.04)" strokeOpacity={0} />
          <ReferenceArea x1={0} x2={5} y1={0} y2={5}  fill="rgba(107,114,128,0.03)" strokeOpacity={0} />
          <ReferenceArea x1={5} x2={10} y1={0} y2={5}  fill="rgba(239,68,68,0.05)"  strokeOpacity={0} />

          {/* Divider lines */}
          <ReferenceLine x={5} stroke="rgba(255,255,255,0.07)" strokeDasharray="6 4" />
          <ReferenceLine y={5} stroke="rgba(255,255,255,0.07)" strokeDasharray="6 4" />

          <CartesianGrid stroke="rgba(255,255,255,0.04)" />

          <XAxis
            type="number"
            dataKey="effort_score"
            domain={[0, 10]}
            tickCount={6}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={{ stroke: "rgba(255,255,255,0.08)" }}
          >
            <Label
              value="Effort →"
              position="insideBottom"
              offset={-12}
              fill="rgba(255,255,255,0.3)"
              fontSize={11}
              fontFamily="monospace"
            />
          </XAxis>

          <YAxis
            type="number"
            dataKey="value_score"
            domain={[0, 10]}
            tickCount={6}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={{ stroke: "rgba(255,255,255,0.08)" }}
          >
            <Label
              value="Value ↑"
              angle={-90}
              position="insideLeft"
              offset={16}
              fill="rgba(255,255,255,0.3)"
              fontSize={11}
              fontFamily="monospace"
            />
          </YAxis>

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.08)" }}
          />

          <Scatter data={data} shape={renderBubble} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
