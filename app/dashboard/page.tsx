import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Your Projects</h1>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          + New Project
        </Link>
      </div>
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">
          No projects yet. Create your first one to get started!
        </p>
      </div>
    </div>
  );
}
