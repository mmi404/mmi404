"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { FormError, SubmitButton, TextAreaField, TextField } from "@/components/admin/fields";
import type { AdminEducation, AdminEducationUpsert } from "@/lib/admin-types";

export function EducationForm({ education }: { education?: AdminEducation }) {
  const router = useRouter();
  const isEdit = Boolean(education);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body: AdminEducationUpsert = {
      institution: String(fd.get("institution") ?? "").trim(),
      degree: String(fd.get("degree") ?? "").trim() || null,
      fieldOfStudy: String(fd.get("fieldOfStudy") ?? "").trim() || null,
      startDate: String(fd.get("startDate") ?? "").trim() || null,
      endDate: String(fd.get("endDate") ?? "").trim() || null,
      description: String(fd.get("description") ?? "").trim() || null,
      sortOrder: Number(fd.get("sortOrder") ?? 0),
    };

    setSubmitting(true);
    setError(null);
    const result = await adminRequest(
      isEdit ? `/education/${education!.id}` : "/education",
      { method: isEdit ? "PUT" : "POST", body }
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.push("/admin/education");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <FormError message={error} />
      <TextField label="Institution" name="institution" defaultValue={education?.institution} required />
      <TextField label="Degree" name="degree" defaultValue={education?.degree ?? ""} />
      <TextField label="Field of study" name="fieldOfStudy" defaultValue={education?.fieldOfStudy ?? ""} />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Start date"
          name="startDate"
          type="date"
          defaultValue={education?.startDate ?? ""}
        />
        <TextField label="End date" name="endDate" type="date" defaultValue={education?.endDate ?? ""} />
      </div>
      <TextAreaField label="Description" name="description" defaultValue={education?.description ?? ""} />
      <TextField
        label="Sort order"
        name="sortOrder"
        type="number"
        defaultValue={education?.sortOrder ?? 0}
        required
      />
      <SubmitButton submitting={submitting}>{isEdit ? "Save changes" : "Create entry"}</SubmitButton>
    </form>
  );
}
