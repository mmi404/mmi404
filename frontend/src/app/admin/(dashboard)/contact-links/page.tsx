import { Suspense } from "react";
import Link from "next/link";
import { adminGetContactLinks } from "@/lib/admin-api";
import { DeleteButton } from "@/components/admin/delete-button";

async function ContactLinkList() {
  const items = await adminGetContactLinks();
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No contact links yet.</p>;
  }
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-slate-500">
          <th className="py-2 pr-4">Label</th>
          <th className="py-2 pr-4">URL</th>
          <th className="py-2 pr-4">Sort order</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-slate-100">
            <td className="py-2 pr-4">{item.label}</td>
            <td className="py-2 pr-4 max-w-xs truncate">{item.url}</td>
            <td className="py-2 pr-4">{item.sortOrder}</td>
            <td className="py-2">
              <div className="flex items-center gap-3">
                <Link href={`/admin/contact-links/${item.id}`} className="text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
                <DeleteButton
                  path={`/contact-links/${item.id}`}
                  confirmText={`Delete "${item.label}"?`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ContactLinksPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Contact Links</h1>
        <Link
          href="/admin/contact-links/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          New link
        </Link>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <ContactLinkList />
      </Suspense>
    </div>
  );
}
