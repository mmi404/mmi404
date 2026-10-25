"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";

export function MarkReadButton({ id, read }: { id: number; read: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    const result = await adminRequest(`/contact-messages/${id}`, {
      method: "PATCH",
      body: { read: !read },
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.refresh();
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
      >
        {loading ? "Saving…" : read ? "Mark as unread" : "Mark as read"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
