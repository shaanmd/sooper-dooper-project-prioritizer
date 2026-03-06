"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProjectForm, { ProjectFormData } from "@/components/ProjectForm";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<Partial<ProjectFormData> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setLoadError(json.error);
        else setInitialData(json.data);
      })
      .catch(() => setLoadError("Failed to load project."));
  }, [id]);

  async function handleSubmit(data: ProjectFormData) {
    setSubmitError(null);
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setSubmitError(json.error ?? "Something went wrong. Please try again.");
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
        <h1 className="mt-3 text-3xl font-extrabold text-cream">Edit Project</h1>
        <p className="mt-1 text-sm text-muted">Update the details for this project.</p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
          {loadError}
        </div>
      )}

      {submitError && (
        <div className="mb-6 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
          {submitError}
        </div>
      )}

      <div className="rounded-2xl border border-rim bg-card p-8">
        {initialData ? (
          <ProjectForm onSubmit={handleSubmit} initialData={initialData} submitLabel="Save Changes" />
        ) : !loadError ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
