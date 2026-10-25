"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import {
  CheckboxField,
  FormError,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import type {
  AdminPersona,
  AdminProject,
  AdminProjectUpsert,
  AdminTechTag,
  VisibilityTier,
} from "@/lib/admin-types";

export function ProjectForm({
  project,
  personas,
  techTags,
}: {
  project?: AdminProject;
  personas: AdminPersona[];
  techTags: AdminTechTag[];
}) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const [tier, setTier] = useState<VisibilityTier>(project?.visibilityTier ?? "ADD");
  // Controlled, not just disabled-on-render: switching to PARTIAL clears
  // these so a stale value typed before the switch can never be submitted.
  // This is the actual confidentiality enforcement point in this UI — the
  // backend's 400 for PARTIAL+liveUrl/githubUrl/clientName comes back with
  // no field-level detail (confirmed directly against the running backend),
  // so relying on that error to tell the admin what went wrong would be a
  // dead end. Making the combination unreachable in the form is the fix.
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [clientName, setClientName] = useState(project?.clientName ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(
    new Set(project?.techTags.map((t) => t.id) ?? [])
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTierChange(next: VisibilityTier) {
    setTier(next);
    if (next === "PARTIAL") {
      setLiveUrl("");
      setGithubUrl("");
      setClientName("");
    }
  }

  function toggleTag(id: number) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body: AdminProjectUpsert = {
      personaId: Number(fd.get("personaId")),
      slug: String(fd.get("slug") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      visibilityTier: tier,
      nontechnicalDescription: String(fd.get("nontechnicalDescription") ?? "").trim() || null,
      technicalDescription: String(fd.get("technicalDescription") ?? "").trim() || null,
      experienceDescription: String(fd.get("experienceDescription") ?? "").trim() || null,
      // Read from state, not FormData: these inputs are disabled when
      // tier === PARTIAL, and disabled inputs are excluded from FormData by
      // the browser, so state is the only reliable source here anyway.
      liveUrl: tier === "ADD" ? liveUrl.trim() || null : null,
      githubUrl: tier === "ADD" ? githubUrl.trim() || null : null,
      clientName: tier === "ADD" ? clientName.trim() || null : null,
      sortOrder: Number(fd.get("sortOrder") ?? 0),
      published: fd.get("published") === "on",
      techTagIds: Array.from(selectedTagIds),
    };

    setSubmitting(true);
    setError(null);
    const result = await adminRequest(
      isEdit ? `/projects/${project!.id}` : "/projects",
      { method: isEdit ? "PUT" : "POST", body }
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    if (isEdit) {
      router.refresh();
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <FormError message={error} />

      <div>
        <label htmlFor="personaId" className="block text-sm font-medium text-slate-700">
          Persona
        </label>
        <select
          id="personaId"
          name="personaId"
          defaultValue={project?.personaId ?? personas[0]?.id}
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.displayName}
            </option>
          ))}
        </select>
      </div>

      <TextField label="Slug" name="slug" defaultValue={project?.slug} required />
      <TextField label="Title" name="title" defaultValue={project?.title} required />

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700">Visibility tier</legend>
        <div className="mt-1 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="visibilityTierRadio"
              checked={tier === "ADD"}
              onChange={() => handleTierChange("ADD")}
              className="text-blue-600 focus:ring-blue-500"
            />
            ADD (full detail)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="visibilityTierRadio"
              checked={tier === "PARTIAL"}
              onChange={() => handleTierChange("PARTIAL")}
              className="text-blue-600 focus:ring-blue-500"
            />
            PARTIAL (confidential)
          </label>
        </div>
        {tier === "PARTIAL" && (
          <p className="mt-1 text-xs text-slate-500">
            PARTIAL-tier projects can&apos;t have a live URL, GitHub URL, or client
            name — those fields are cleared and disabled below, and images can&apos;t
            be uploaded for this project (the upload control only appears for ADD
            projects, after saving).
          </p>
        )}
      </fieldset>

      <TextAreaField
        label="Nontechnical description"
        name="nontechnicalDescription"
        defaultValue={project?.nontechnicalDescription ?? ""}
      />
      <TextAreaField
        label="Technical description"
        name="technicalDescription"
        defaultValue={project?.technicalDescription ?? ""}
      />
      <TextAreaField
        label="Experience description"
        name="experienceDescription"
        defaultValue={project?.experienceDescription ?? ""}
      />

      <TextField
        label="Live URL"
        name="liveUrl"
        type="url"
        value={liveUrl}
        disabled={tier === "PARTIAL"}
        onChange={(e) => setLiveUrl(e.target.value)}
      />
      <TextField
        label="GitHub URL"
        name="githubUrl"
        type="url"
        value={githubUrl}
        disabled={tier === "PARTIAL"}
        onChange={(e) => setGithubUrl(e.target.value)}
      />
      <TextField
        label="Client name"
        name="clientName"
        value={clientName}
        disabled={tier === "PARTIAL"}
        onChange={(e) => setClientName(e.target.value)}
      />

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700">Tech tags</legend>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2">
          {techTags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={selectedTagIds.has(tag.id)}
                onChange={() => toggleTag(tag.id)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {tag.name}
            </label>
          ))}
          {techTags.length === 0 && (
            <p className="text-sm text-slate-500">No tech tags yet — create some first.</p>
          )}
        </div>
      </fieldset>

      <TextField
        label="Sort order"
        name="sortOrder"
        type="number"
        defaultValue={project?.sortOrder ?? 0}
        required
      />
      <CheckboxField label="Published" name="published" defaultChecked={project?.published ?? true} />

      <SubmitButton submitting={submitting}>{isEdit ? "Save changes" : "Create project"}</SubmitButton>
    </form>
  );
}
