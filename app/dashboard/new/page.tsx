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
          className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
          New Project
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Capture the idea. We&apos;ll help you figure out if it&apos;s worth your time.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border-2 border-gray-300 bg-white p-8">
        <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
      </div>
    </div>
  );
}
