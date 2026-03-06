"use client";

import { useState, KeyboardEvent } from "react";

export interface ProjectFormData {
  name: string;
  description: string;
  passion_level: number;
  goal_alignment: "High" | "Medium" | "Low";
  learning_goals: string[];
  constraints: string;
  already_started: boolean;
  completion_percentage: number;
  what_stopped_you: string;
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
  goal_alignment: "Medium",
  learning_goals: [],
  constraints: "",
  already_started: false,
  completion_percentage: 0,
  what_stopped_you: "",
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
  { value: "High",   label: "High",   desc: "Core to my goals" },
  { value: "Medium", label: "Medium", desc: "Relevant" },
  { value: "Low",    label: "Low",    desc: "Nice to have" },
];

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
      {children}
      {optional && (
        <span className="ml-2 text-xs normal-case font-normal tracking-normal text-rim">
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
  "w-full rounded-xl border border-rim bg-ink/60 px-4 py-3 text-cream placeholder-muted/50 " +
  "focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20 transition-all duration-200 " +
  "hover:border-muted/60";

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
        <FieldLabel>Project Name <span className="text-rose ml-0.5">*</span></FieldLabel>
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
        <FieldLabel>Description <span className="text-rose ml-0.5">*</span></FieldLabel>
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
        <div className="rounded-xl border border-rim bg-ink/60 p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <span
                className="font-mono text-4xl font-bold leading-none transition-colors duration-300"
                style={{ color: passion.color }}
              >
                {form.passion_level}
              </span>
              <span className="text-muted font-mono text-sm">/10</span>
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
              background: `linear-gradient(to right, ${passion.color} ${passionPct}%, #222650 ${passionPct}%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-muted font-mono">
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
                  "rounded-xl border px-3 py-3 text-left transition-all duration-200",
                  active
                    ? "border-amber bg-amber/10 text-amber"
                    : "border-rim bg-ink/40 text-muted hover:border-muted/60 hover:text-cream",
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
            className="rounded-xl border border-rim bg-card px-4 py-3 text-sm font-semibold text-cream hover:border-amber hover:text-amber transition-all duration-200"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-muted">Press Enter or comma to add</p>

        {form.learning_goals.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.learning_goals.map((tag) => (
              <span
                key={tag}
                className={[
                  "inline-flex items-center gap-1.5 rounded-lg border border-glow/30 bg-glow/10",
                  "px-3 py-1.5 text-sm font-medium text-glow",
                  newTags.has(tag) ? "animate-tag-pop" : "",
                ].join(" ")}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-glow/50 hover:text-rose transition-colors leading-none"
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
      <div className="rounded-xl border border-rim bg-ink/40 p-5 space-y-4">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div>
            <div className="font-semibold text-cream">Already started?</div>
            <div className="text-xs text-muted mt-0.5">Track your current progress</div>
          </div>

          {/* Toggle */}
          <div className="relative">
            <input
              type="checkbox"
              checked={form.already_started}
              onChange={(e) => set("already_started", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 rounded-full bg-rim peer-checked:bg-amber transition-colors duration-200" />
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-muted shadow transition-all duration-200 peer-checked:translate-x-6 peer-checked:bg-ink" />
          </div>
        </label>

        {form.already_started && (
          <div className="space-y-5 pt-2 border-t border-rim">
            {/* Completion % */}
            <FieldWrap>
              <FieldLabel>Completion</FieldLabel>
              <div className="rounded-xl border border-rim bg-ink/60 p-4">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-mono text-3xl font-bold text-glow">
                    {form.completion_percentage}
                  </span>
                  <span className="text-muted font-mono text-sm">%</span>
                  <span className="text-xs text-muted ml-2">done</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.completion_percentage}
                  onChange={(e) => set("completion_percentage", Number(e.target.value))}
                  className="sdp-slider sdp-slider-rose"
                  style={{
                    background: `linear-gradient(to right, #818CF8 ${completionPct}%, #222650 ${completionPct}%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-muted font-mono">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </FieldWrap>

            {/* What stopped you */}
            <FieldWrap>
              <FieldLabel optional>What stopped you?</FieldLabel>
              <textarea
                value={form.what_stopped_you}
                onChange={(e) => set("what_stopped_you", e.target.value)}
                placeholder="What got in the way or caused you to pause?"
                rows={2}
                className={inputBase + " resize-none"}
              />
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
          "bg-gradient-to-r from-amber to-rose",
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
