import { Suspense } from "react";
import Link from "next/link";
import { adminGetProjects } from "@/lib/admin-api";
import { DeleteButton } from "@/components/admin/delete-button";

async function ProjectList() {
  const projects = await adminGetProjects();
  if (projects.length === 0) {
    return <p className="text-sm text-slate-500">No projects yet.</p>;
  }
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-slate-500">
          <th className="py-2 pr-4">Title</th>
          <th className="py-2 pr-4">Slug</th>
          <th className="py-2 pr-4">Tier</th>
          <th className="py-2 pr-4">Published</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id} className="border-b border-slate-100">
            <td className="py-2 pr-4">{p.title}</td>
            <td className="py-2 pr-4 font-mono text-xs">{p.slug}</td>
            <td className="py-2 pr-4">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  p.visibilityTier === "ADD"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {p.visibilityTier}
              </span>
            </td>
            <td className="py-2 pr-4">{p.published ? "Yes" : "No"}</td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <Link href={`/admin/projects/${p.id}`} className="text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
                <DeleteButton path={`/projects/${p.id}`} confirmText={`Delete project "${p.title}"?`} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          New project
        </Link>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
