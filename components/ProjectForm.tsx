"use client";

import { useState, KeyboardEvent } from "react";

export interface ProjectFormData {
  name: string;
  description: string;
  passion_level: number;
  goal_alignment: "high" | "medium" | "low";
  learning_goals: string[];
  constraints: string;
  is_started: boolean;
  completion_percentage: number;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: Partial<ProjectFormData>;
  submitLabel?: string;
}

const defaultData: ProjectFormData = {
  name: "",
  description: "",
  passion_level: 5,
  goal_alignment: "medium",
  learning_goals: [],
  constraints: "",
  is_started: false,
  completion_percentage: 0,
};

const passionMeta = (level: number): { emoji: string; label: string; color: string } => {
  if (level <= 2) return { emoji: "😴", label: "Rather not", color: "#7775A6" };
  if (level <= 4) return { emoji: "🤔", label: "Maybe?",     color: "#818CF8" };
  if (level <= 6) return { emoji: "🙂", label: "Interested", color: "#60A5FA" };
  if (level <= 8) return { emoji: "🚀", label: "Pumped",     color: "#F5A623" };
  if (level <= 9) return { emoji: "🤩", label: "All-in",     color: "#F97316" };
  return              { emoji: "🔥", label: "OBSESSED",    color: "#F43F5E" };
};

const ALIGNMENTS: Array<{ value: ProjectFormData["goal_alignment"]; label: string; desc: string }> = [
  { value: "high",   label: "High",   desc: "Core to my goals" },
  { value: "medium", label: "Medium", desc: "Relevant" },
  { value: "low",    label: "Low",    desc: "Nice to have" },
];

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
      {children}
      {optional && (
        <span className="ml-2 text-xs normal-case font-normal tracking-normal text-gray-400">
          optional
        </span>
      )}
    </label>
  );
}

function FieldWrap({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

const inputBase =
  "w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 " +
  "focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 " +
  "hover:border-gray-400";

export default function ProjectForm({
  onSubmit,
  initialData,
  submitLabel = "Save Project",
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>({ ...defaultData, ...initialData });
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newTags, setNewTags] = useState<Set<string>>(new Set());

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.learning_goals.includes(tag)) {
      set("learning_goals", [...form.learning_goals, tag]);
      setNewTags((prev) => new Set(prev).add(tag));
      setTimeout(() => setNewTags((prev) => { const n = new Set(prev); n.delete(tag); return n; }), 300);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("learning_goals", form.learning_goals.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  const passion = passionMeta(form.passion_level);
  const passionPct = ((form.passion_level - 1) / 9) * 100;
  const completionPct = form.completion_percentage;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Project Name ─────────────────────────── */}
      <FieldWrap>
        <FieldLabel>Project Name <span className="text-rose-500 ml-0.5">*</span></FieldLabel>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g., Personal Finance Tracker"
          className={inputBase + " font-semibold text-lg"}
        />
      </FieldWrap>

      {/* ── Description ──────────────────────────── */}
      <FieldWrap>
        <FieldLabel>Description <span className="text-rose-500 ml-0.5">*</span></FieldLabel>
        <textarea
          required
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe your project in 2–3 sentences"
          rows={3}
          className={inputBase + " resize-none leading-relaxed"}
        />
      </FieldWrap>

      {/* ── Passion Level ────────────────────────── */}
      <FieldWrap>
        <FieldLabel>Passion Level</FieldLabel>
        <div className="rounded-xl border-2 border-gray-300 bg-gray-50 p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <span
                className="font-mono text-4xl font-bold leading-none transition-colors duration-300"
                style={{ color: passion.color }}
              >
                {form.passion_level}
              </span>
              <span className="text-gray-400 font-mono text-sm">/10</span>
            </div>
            <div className="text-right">
              <div className="text-3xl leading-none mb-1">{passion.emoji}</div>
              <div
                className="text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                style={{ color: passion.color }}
              >
                {passion.label}
              </div>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={form.passion_level}
            onChange={(e) => set("passion_level", Number(e.target.value))}
            className="sdp-slider"
            style={{
              background: `linear-gradient(to right, ${passion.color} ${passionPct}%, #E5E7EB ${passionPct}%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
            <span>1 — meh</span>
            <span>10 — obsessed</span>
          </div>
        </div>
      </FieldWrap>

      {/* ── Goal Alignment ───────────────────────── */}
      <FieldWrap>
        <FieldLabel>Goal Alignment</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {ALIGNMENTS.map(({ value, label, desc }) => {
            const active = form.goal_alignment === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => set("goal_alignment", value)}
                className={[
                  "rounded-xl border-2 px-3 py-3 text-left transition-all duration-200",
                  active
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700",
                ].join(" ")}
              >
                <div className="font-bold text-sm">{label}</div>
                <div className="text-xs mt-0.5 opacity-70">{desc}</div>
              </button>
            );
          })}
        </div>
      </FieldWrap>

      {/* ── Learning Goals ───────────────────────── */}
      <FieldWrap>
        <FieldLabel>Learning Goals</FieldLabel>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="TypeScript, system design…"
            className={inputBase + " flex-1"}
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-all duration-200"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400">Press Enter or comma to add</p>

        {form.learning_goals.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.learning_goals.map((tag) => (
              <span
                key={tag}
                className={[
                  "inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50",
                  "px-3 py-1.5 text-sm font-medium text-indigo-600",
                  newTags.has(tag) ? "animate-tag-pop" : "",
                ].join(" ")}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-indigo-400 hover:text-rose-500 transition-colors leading-none"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </FieldWrap>

      {/* ── Constraints ──────────────────────────── */}
      <FieldWrap>
        <FieldLabel optional>Constraints</FieldLabel>
        <textarea
          value={form.constraints}
          onChange={(e) => set("constraints", e.target.value)}
          placeholder="e.g., Must launch before Christmas, max $500 budget"
          rows={2}
          className={inputBase + " resize-none"}
        />
      </FieldWrap>

      {/* ── Already Started? ─────────────────────── */}
      <div className="rounded-xl border-2 border-gray-300 bg-gray-50 p-5 space-y-4">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div>
            <div className="font-semibold text-gray-900">Already started?</div>
            <div className="text-xs text-gray-500 mt-0.5">Track your current progress</div>
          </div>

          {/* Toggle */}
          <div className="relative">
            <input
              type="checkbox"
              checked={form.is_started}
              onChange={(e) => set("is_started", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-amber-400 transition-colors duration-200" />
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 peer-checked:translate-x-6" />
          </div>
        </label>

        {form.is_started && (
          <div className="space-y-5 pt-2 border-t border-gray-200">
            {/* Completion % */}
            <FieldWrap>
              <FieldLabel>Completion</FieldLabel>
              <div className="rounded-xl border-2 border-gray-300 bg-white p-4">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-mono text-3xl font-bold text-indigo-500">
                    {form.completion_percentage}
                  </span>
                  <span className="text-gray-400 font-mono text-sm">%</span>
                  <span className="text-xs text-gray-400 ml-2">done</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.completion_percentage}
                  onChange={(e) => set("completion_percentage", Number(e.target.value))}
                  className="sdp-slider sdp-slider-rose"
                  style={{
                    background: `linear-gradient(to right, #818CF8 ${completionPct}%, #E5E7EB ${completionPct}%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </FieldWrap>
          </div>
        )}
      </div>

      {/* ── Submit ───────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting}
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
        {/* Shimmer layer */}
        {!submitting && (
          <span
            className="animate-shimmer absolute inset-0 w-1/3 bg-white/20 blur-sm"
            aria-hidden
          />
        )}

        <span className="relative flex items-center justify-center gap-3">
          {submitting ? (
            <>
              <span
                className="animate-spin-slow block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </span>
      </button>
    </form>
  );
}
