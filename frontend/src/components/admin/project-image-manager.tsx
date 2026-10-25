"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { resolveMediaUrl } from "@/lib/api";
import type { AdminProjectImage } from "@/lib/admin-types";

/**
 * Only rendered for ADD-tier projects (see the parent edit page) — PARTIAL
 * projects get no upload control at all, per the confidentiality rule.
 * Project images also only make sense once the project has an id, so this
 * is only shown on the edit page, not while creating a new project.
 */
export function ProjectImageManager({
  projectId,
  images,
}: {
  projectId: number;
  images: AdminProjectImage[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (!(fd.get("file") instanceof File) || (fd.get("file") as File).size === 0) {
      setError("Choose an image file first.");
      return;
    }

    setUploading(true);
    setError(null);
    const result = await adminRequest(`/projects/${projectId}/images`, {
      method: "POST",
      formData: fd,
    });
    setUploading(false);
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    form.reset();
    router.refresh();
  }

  async function handleDelete(imageId: number) {
    if (!window.confirm("Delete this image?")) return;
    const result = await adminRequest(`/project-images/${imageId}`, { method: "DELETE" });
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.refresh();
  }

  async function handleUpdate(imageId: number, caption: string, sortOrder: number) {
    const result = await adminRequest(`/project-images/${imageId}`, {
      method: "PUT",
      body: { caption: caption.trim() || null, sortOrder },
    });
    if (!result.ok) {
      setError(result.errorMessage);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image) => (
          <li key={image.id} className="rounded-md border border-slate-200 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaUrl(image.imageUrl) ?? image.imageUrl}
              alt={image.caption ?? ""}
              className="h-28 w-full rounded object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <ImageMetaForm
              image={image}
              onSave={(caption, sortOrder) => handleUpdate(image.id, caption, sortOrder)}
              onDelete={() => handleDelete(image.id)}
            />
          </li>
        ))}
      </ul>
      {images.length === 0 && (
        <p className="text-sm text-slate-500">No images uploaded yet.</p>
      )}

      <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3 border-t border-slate-200 pt-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-slate-700">
            New image
          </label>
          <input
            ref={fileInputRef}
            id="file"
            name="file"
            type="file"
            accept="image/*"
            required
            className="mt-1 block text-sm"
          />
        </div>
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-slate-700">
            Caption
          </label>
          <input
            id="caption"
            name="caption"
            type="text"
            className="mt-1 block rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={images.length}
            className="mt-1 block w-20 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}

function ImageMetaForm({
  image,
  onSave,
  onDelete,
}: {
  image: AdminProjectImage;
  onSave: (caption: string, sortOrder: number) => void;
  onDelete: () => void;
}) {
  const [caption, setCaption] = useState(image.caption ?? "");
  const [sortOrder, setSortOrder] = useState(image.sortOrder);

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className="block w-full rounded-md border-slate-300 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-16 rounded-md border-slate-300 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => onSave(caption, sortOrder)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Save
        </button>
        <button type="button" onClick={onDelete} className="text-xs text-red-600 hover:text-red-800">
          Delete
        </button>
      </div>
    </div>
  );
}
