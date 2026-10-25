import { Suspense } from "react";
import { adminGetPersonas, adminGetTechTags } from "@/lib/admin-api";
import { ProjectForm } from "@/components/admin/project-form";

async function NewProjectContent() {
  const [personas, techTags] = await Promise.all([adminGetPersonas(), adminGetTechTags()]);
  return <ProjectForm personas={personas} techTags={techTags} />;
}

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">New project</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <NewProjectContent />
      </Suspense>
    </div>
  );
}
