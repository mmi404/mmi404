"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";

export function DeleteButton({
  path,
  confirmText,
  redirectTo,
}: {
  path: string;
  confirmText?: string;
  /** If set, navigate here after a successful delete (e.g. back to a list page). */
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(confirmText ?? "Delete this item? This cannot be undone.")) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await adminRequest(path, { method: "DELETE" });
    setLoading(false);
    if (!result.ok) {
      setError(result.errorMessage ?? "Delete failed.");
      return;
    }
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
