"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { FormError, SubmitButton, TextField } from "@/components/admin/fields";
import type { AdminContactLink, AdminContactLinkUpsert } from "@/lib/admin-types";

export function ContactLinkForm({ contactLink }: { contactLink?: AdminContactLink }) {
  const router = useRouter();
  const isEdit = Boolean(contactLink);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body: AdminContactLinkUpsert = {
      label: String(fd.get("label") ?? "").trim(),
      url: String(fd.get("url") ?? "").trim(),
      iconKey: String(fd.get("iconKey") ?? "").trim() || null,
      sortOrder: Number(fd.get("sortOrder") ?? 0),
    };

    setSubmitting(true);
    setError(null);
    const result = await adminRequest(
      isEdit ? `/contact-links/${contactLink!.id}` : "/contact-links",
      { method: isEdit ? "PUT" : "POST", body }
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.push("/admin/contact-links");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <FormError message={error} />
      <TextField label="Label" name="label" defaultValue={contactLink?.label} required />
      <TextField label="URL" name="url" type="url" defaultValue={contactLink?.url} required />
      <TextField label="Icon key" name="iconKey" defaultValue={contactLink?.iconKey ?? ""} />
      <TextField
        label="Sort order"
        name="sortOrder"
        type="number"
        defaultValue={contactLink?.sortOrder ?? 0}
        required
      />
      <SubmitButton submitting={submitting}>{isEdit ? "Save changes" : "Create link"}</SubmitButton>
    </form>
  );
}
