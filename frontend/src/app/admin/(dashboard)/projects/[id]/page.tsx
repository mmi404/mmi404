import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminGetPersonas, adminGetProject, adminGetTechTags } from "@/lib/admin-api";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectImageManager } from "@/components/admin/project-image-manager";

async function EditProjectContent({ id }: { id: number }) {
  const [project, personas, techTags] = await Promise.all([
    adminGetProject(id),
    adminGetPersonas(),
    adminGetTechTags(),
  ]);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-10">
      <ProjectForm project={project} personas={personas} techTags={techTags} />

      {project.visibilityTier === "ADD" ? (
        <div className="border-t border-slate-200 pt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Images</h2>
          <ProjectImageManager projectId={project.id} images={project.images} />
        </div>
      ) : (
        <div className="border-t border-slate-200 pt-8">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Images</h2>
          <p className="text-sm text-slate-500">
            PARTIAL-tier projects can&apos;t have images — the upload control
            only appears for ADD-tier projects. Switch the tier above (and
            save) to enable it.
          </p>
        </div>
      )}
    </div>
  );
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Edit project</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EditProjectContent id={numericId} />
      </Suspense>
    </div>
  );
}
