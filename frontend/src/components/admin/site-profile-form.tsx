"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { FormError, SubmitButton, TextAreaField, TextField } from "@/components/admin/fields";
import type { AdminSiteProfile, AdminSiteProfileUpsert } from "@/lib/admin-types";

export function SiteProfileForm({ profile }: { profile: AdminSiteProfile | null }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body: AdminSiteProfileUpsert = {
      fullName: String(fd.get("fullName") ?? "").trim(),
      headline: String(fd.get("headline") ?? "").trim() || null,
      aboutMeMarkdown: String(fd.get("aboutMeMarkdown") ?? "").trim() || null,
      profilePhotoUrl: String(fd.get("profilePhotoUrl") ?? "").trim() || null,
      resumeUrl: String(fd.get("resumeUrl") ?? "").trim() || null,
    };

    setSubmitting(true);
    setError(null);
    setSaved(false);
    // PUT /api/admin/site-profile both creates (first time) and updates — it's
    // a singleton resource, confirmed no separate POST endpoint exists.
    const result = await adminRequest("/site-profile", { method: "PUT", body });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <FormError message={error} />
      {saved && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Saved.</p>
      )}
      <TextField label="Full name" name="fullName" defaultValue={profile?.fullName ?? ""} required />
      <TextField label="Headline" name="headline" defaultValue={profile?.headline ?? ""} />
      <TextAreaField
        label="About me (markdown)"
        name="aboutMeMarkdown"
        defaultValue={profile?.aboutMeMarkdown ?? ""}
        rows={8}
      />
      <TextField
        label="Profile photo URL"
        name="profilePhotoUrl"
        defaultValue={profile?.profilePhotoUrl ?? ""}
        hint="Relative path returned by an upload, or a full URL."
      />
      <TextField label="Resume URL" name="resumeUrl" defaultValue={profile?.resumeUrl ?? ""} />
      <SubmitButton submitting={submitting}>Save</SubmitButton>
    </form>
  );
}
