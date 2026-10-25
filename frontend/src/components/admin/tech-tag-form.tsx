"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { FormError, SubmitButton, TextField } from "@/components/admin/fields";
import type { AdminTechTag, AdminTechTagUpsert } from "@/lib/admin-types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TechTagForm({ techTag }: { techTag?: AdminTechTag }) {
  const router = useRouter();
  const isEdit = Boolean(techTag);
  const [name, setName] = useState(techTag?.name ?? "");
  const [slug, setSlug] = useState(techTag?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const body: AdminTechTagUpsert = { name: name.trim(), slug: slug.trim() };

    setSubmitting(true);
    setError(null);
    const result = await adminRequest(
      isEdit ? `/tech-tags/${techTag!.id}` : "/tech-tags",
      { method: isEdit ? "PUT" : "POST", body }
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.push("/admin/tech-tags");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <FormError message={error} />
      <TextField
        label="Name"
        name="name"
        value={name}
        required
        onChange={(e) => {
          const value = e.target.value;
          setName(value);
          if (!slugTouched) setSlug(slugify(value));
        }}
      />
      <TextField
        label="Slug"
        name="slug"
        value={slug}
        required
        hint="Not auto-normalized by the backend — this is derived from the name but you can edit it."
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
      />
      <SubmitButton submitting={submitting}>{isEdit ? "Save changes" : "Create tag"}</SubmitButton>
    </form>
  );
}
