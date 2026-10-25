import { Suspense } from "react";
import Link from "next/link";
import { adminGetClubActivities } from "@/lib/admin-api";
import { DeleteButton } from "@/components/admin/delete-button";

async function ClubActivityList() {
  const items = await adminGetClubActivities();
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No club/extracurricular activities yet.</p>;
  }
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-slate-500">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Role</th>
          <th className="py-2 pr-4">Sort order</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-slate-100">
            <td className="py-2 pr-4">{item.name}</td>
            <td className="py-2 pr-4">{item.role ?? "—"}</td>
            <td className="py-2 pr-4">{item.sortOrder}</td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <Link href={`/admin/club-activities/${item.id}`} className="text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
                <DeleteButton
                  path={`/club-activities/${item.id}`}
                  confirmText={`Delete "${item.name}"?`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ClubActivitiesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Club &amp; Extracurricular Activities</h1>
        <Link
          href="/admin/club-activities/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          New entry
        </Link>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <ClubActivityList />
      </Suspense>
    </div>
  );
}
