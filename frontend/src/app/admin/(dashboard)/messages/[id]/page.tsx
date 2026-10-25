import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetContactMessage } from "@/lib/admin-api";
import { MarkReadButton } from "@/components/admin/mark-read-button";

async function MessageDetail({ id }: { id: number }) {
  const message = await adminGetContactMessage(id);
  if (!message) notFound();

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            message.read ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-800"
          }`}
        >
          {message.read ? "Read" : "Unread"}
        </span>
        <span className="text-sm text-slate-500">
          {new Date(message.submittedAt).toLocaleString()}
        </span>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <p className="whitespace-pre-wrap text-sm text-slate-900">{message.messageBody}</p>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-slate-500">Reply email</dt>
        <dd>{message.replyEmail ?? "—"}</dd>
        <dt className="text-slate-500">Reply phone</dt>
        <dd>{message.replyPhone ?? "—"}</dd>
        <dt className="text-slate-500">IP address</dt>
        <dd className="font-mono text-xs">{message.ipAddress}</dd>
        <dt className="text-slate-500">User agent</dt>
        <dd className="break-all text-xs">{message.userAgent ?? "—"}</dd>
      </dl>

      <div>
        <MarkReadButton id={message.id} read={message.read} />
      </div>
    </div>
  );
}

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <Link href="/admin/messages" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Back to messages
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-semibold text-slate-900">Message #{numericId}</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <MessageDetail id={numericId} />
      </Suspense>
    </div>
  );
}
