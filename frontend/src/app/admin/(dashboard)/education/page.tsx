import { Suspense } from "react";
import Link from "next/link";
import { adminGetEducationList } from "@/lib/admin-api";
import { DeleteButton } from "@/components/admin/delete-button";

async function EducationList() {
  const items = await adminGetEducationList();
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No education entries yet.</p>;
  }
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-slate-500">
          <th className="py-2 pr-4">Institution</th>
          <th className="py-2 pr-4">Degree</th>
          <th className="py-2 pr-4">Sort order</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-slate-100">
            <td className="py-2 pr-4">{item.institution}</td>
            <td className="py-2 pr-4">{item.degree ?? "—"}</td>
            <td className="py-2 pr-4">{item.sortOrder}</td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <Link href={`/admin/education/${item.id}`} className="text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
                <DeleteButton
                  path={`/education/${item.id}`}
                  confirmText={`Delete "${item.institution}"?`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function EducationPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Education</h1>
        <Link
          href="/admin/education/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          New entry
        </Link>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EducationList />
      </Suspense>
    </div>
  );
}
