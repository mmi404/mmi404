import { Suspense } from "react";
import Link from "next/link";
import { adminGetPersonas } from "@/lib/admin-api";
import { DeleteButton } from "@/components/admin/delete-button";

async function PersonaList() {
  const personas = await adminGetPersonas();

  if (personas.length === 0) {
    return <p className="text-sm text-slate-500">No personas yet.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-slate-500">
          <th className="py-2 pr-4">Slug</th>
          <th className="py-2 pr-4">Display name</th>
          <th className="py-2 pr-4">Nav order</th>
          <th className="py-2 pr-4">Published</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {personas.map((p) => (
          <tr key={p.id} className="border-b border-slate-100">
            <td className="py-2 pr-4 font-mono text-xs">{p.slug}</td>
            <td className="py-2 pr-4">{p.displayName}</td>
            <td className="py-2 pr-4">{p.navOrder}</td>
            <td className="py-2 pr-4">{p.published ? "Yes" : "No"}</td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <Link href={`/admin/personas/${p.id}`} className="text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
                <DeleteButton path={`/personas/${p.id}`} confirmText={`Delete persona "${p.displayName}"?`} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PersonasPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Personas</h1>
        <Link
          href="/admin/personas/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          New persona
        </Link>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <PersonaList />
      </Suspense>
    </div>
  );
}
