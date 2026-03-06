"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectForm, { ProjectFormData } from "@/components/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: ProjectFormData) {
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-xs font-mono uppercase tracking-widest text-muted hover:text-cream transition-colors"
        >
          ← Back
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold text-cream">
          New Project
        </h1>
        <p className="mt-1 text-sm text-muted">
          Capture the idea. We&apos;ll help you figure out if it&apos;s worth your time.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-rim bg-card p-8">
        <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
      </div>
    </div>
  );
}
