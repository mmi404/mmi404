"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { CheckboxField, FormError, SubmitButton, TextAreaField, TextField } from "@/components/admin/fields";
import type { AdminPersona, AdminPersonaUpsert } from "@/lib/admin-types";

export function PersonaForm({ persona }: { persona?: AdminPersona }) {
  const router = useRouter();
  const isEdit = Boolean(persona);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body: AdminPersonaUpsert = {
      slug: String(fd.get("slug") ?? "").trim(),
      displayName: String(fd.get("displayName") ?? "").trim(),
      tagline: String(fd.get("tagline") ?? "").trim() || null,
      iconKey: String(fd.get("iconKey") ?? "").trim() || null,
      navOrder: Number(fd.get("navOrder") ?? 0),
      published: fd.get("published") === "on",
      headline: String(fd.get("headline") ?? "").trim() || null,
      introMarkdown: String(fd.get("introMarkdown") ?? "").trim() || null,
    };

    setSubmitting(true);
    setError(null);

    const result = await adminRequest(
      isEdit ? `/personas/${persona!.id}` : "/personas",
      { method: isEdit ? "PUT" : "POST", body }
    );

    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.push("/admin/personas");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <FormError message={error} />
      <TextField label="Slug" name="slug" defaultValue={persona?.slug} required maxLength={100} />
      <TextField
        label="Display name"
        name="displayName"
        defaultValue={persona?.displayName}
        required
        maxLength={150}
      />
      <TextField label="Tagline" name="tagline" defaultValue={persona?.tagline ?? ""} maxLength={255} />
      <TextField
        label="Icon key"
        name="iconKey"
        defaultValue={persona?.iconKey ?? ""}
        maxLength={100}
        hint={'Matches an icon identifier used by the frontend (e.g. "code").'}
      />
      <TextField
        label="Nav order"
        name="navOrder"
        type="number"
        defaultValue={persona?.navOrder ?? 1}
        required
      />
      <TextField label="Headline" name="headline" defaultValue={persona?.headline ?? ""} maxLength={255} />
      <TextAreaField
        label="Intro (markdown)"
        name="introMarkdown"
        defaultValue={persona?.introMarkdown ?? ""}
        rows={6}
      />
      <CheckboxField label="Published" name="published" defaultChecked={persona?.published ?? true} />
      <SubmitButton submitting={submitting}>{isEdit ? "Save changes" : "Create persona"}</SubmitButton>
    </form>
  );
}
