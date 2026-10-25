"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { FormError, SubmitButton, TextAreaField, TextField } from "@/components/admin/fields";
import type { AdminClubActivity, AdminClubActivityUpsert } from "@/lib/admin-types";

export function ClubActivityForm({ clubActivity }: { clubActivity?: AdminClubActivity }) {
  const router = useRouter();
  const isEdit = Boolean(clubActivity);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body: AdminClubActivityUpsert = {
      name: String(fd.get("name") ?? "").trim(),
      role: String(fd.get("role") ?? "").trim() || null,
      description: String(fd.get("description") ?? "").trim() || null,
      startDate: String(fd.get("startDate") ?? "").trim() || null,
      endDate: String(fd.get("endDate") ?? "").trim() || null,
      sortOrder: Number(fd.get("sortOrder") ?? 0),
    };

    setSubmitting(true);
    setError(null);
    const result = await adminRequest(
      isEdit ? `/club-activities/${clubActivity!.id}` : "/club-activities",
      { method: isEdit ? "PUT" : "POST", body }
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.push("/admin/club-activities");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <FormError message={error} />
      <TextField label="Name" name="name" defaultValue={clubActivity?.name} required />
      <TextField label="Role" name="role" defaultValue={clubActivity?.role ?? ""} />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Start date"
          name="startDate"
          type="date"
          defaultValue={clubActivity?.startDate ?? ""}
        />
        <TextField label="End date" name="endDate" type="date" defaultValue={clubActivity?.endDate ?? ""} />
      </div>
      <TextAreaField label="Description" name="description" defaultValue={clubActivity?.description ?? ""} />
      <TextField
        label="Sort order"
        name="sortOrder"
        type="number"
        defaultValue={clubActivity?.sortOrder ?? 0}
        required
      />
      <SubmitButton submitting={submitting}>{isEdit ? "Save changes" : "Create entry"}</SubmitButton>
    </form>
  );
}
