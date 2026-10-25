import { Suspense } from "react";
import Link from "next/link";
import { adminGetContactMessages } from "@/lib/admin-api";

type FilterValue = "all" | "unread" | "read";

function filterToIsRead(filter: FilterValue): boolean | undefined {
  if (filter === "unread") return false;
  if (filter === "read") return true;
  return undefined;
}

function buildHref(filter: FilterValue, page: number) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (page > 0) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/messages?${qs}` : "/admin/messages";
}

async function MessagesContent({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter: FilterValue =
    sp.filter === "unread" || sp.filter === "read" ? sp.filter : "all";
  const page = Number(sp.page ?? 0) || 0;

  const data = await adminGetContactMessages({ page, isRead: filterToIsRead(filter) });

  return (
    <div>
      <div className="mb-4 flex gap-1 text-sm">
        {(["all", "unread", "read"] as FilterValue[]).map((f) => (
          <Link
            key={f}
            href={buildHref(f, 0)}
            className={`rounded-md px-3 py-1.5 ${
              filter === f ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
          </Link>
        ))}
      </div>

      {data.content.length === 0 ? (
        <p className="text-sm text-slate-500">No messages.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Message</th>
              <th className="py-2 pr-4">Reply to</th>
              <th className="py-2 pr-4">Submitted</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((m) => (
              <tr key={m.id} className="border-b border-slate-100">
                <td className="py-2 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      m.read ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {m.read ? "Read" : "Unread"}
                  </span>
                </td>
                <td className="max-w-sm truncate py-2 pr-4">{m.messageBody}</td>
                <td className="py-2 pr-4">{m.replyEmail ?? m.replyPhone ?? "—"}</td>
                <td className="py-2 pr-4">{new Date(m.submittedAt).toLocaleString()}</td>
                <td className="py-2">
                  <Link href={`/admin/messages/${m.id}`} className="text-blue-600 hover:text-blue-800">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.totalPages > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <Link
            href={buildHref(filter, Math.max(0, page - 1))}
            aria-disabled={data.first}
            className={`rounded-md px-3 py-1.5 ${
              data.first
                ? "pointer-events-none text-slate-300"
                : "text-blue-600 hover:bg-slate-200"
            }`}
          >
            Previous
          </Link>
          <span className="text-slate-500">
            Page {data.number + 1} of {data.totalPages}
          </span>
          <Link
            href={buildHref(filter, page + 1)}
            aria-disabled={data.last}
            className={`rounded-md px-3 py-1.5 ${
              data.last ? "pointer-events-none text-slate-300" : "text-blue-600 hover:bg-slate-200"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Messages</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <MessagesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
