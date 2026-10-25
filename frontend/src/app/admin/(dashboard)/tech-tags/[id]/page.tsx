import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminGetTechTag } from "@/lib/admin-api";
import { TechTagForm } from "@/components/admin/tech-tag-form";

async function EditTechTagContent({ id }: { id: number }) {
  const item = await adminGetTechTag(id);
  if (!item) notFound();
  return <TechTagForm techTag={item} />;
}

export default async function EditTechTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Edit tech tag</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EditTechTagContent id={numericId} />
      </Suspense>
    </div>
  );
}
