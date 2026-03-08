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
          className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">Edit Project</h1>
        <p className="mt-1 text-sm text-gray-500">Update the details for this project.</p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      )}

      {submitError && (
        <div className="mb-6 rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {submitError}
        </div>
      )}

      <div className="rounded-2xl border-2 border-gray-300 bg-white p-8">
        {initialData ? (
          <ProjectForm onSubmit={handleSubmit} initialData={initialData} submitLabel="Save Changes" />
        ) : !loadError ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
