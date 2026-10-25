import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminGetEducation } from "@/lib/admin-api";
import { EducationForm } from "@/components/admin/education-form";

async function EditEducationContent({ id }: { id: number }) {
  const item = await adminGetEducation(id);
  if (!item) notFound();
  return <EducationForm education={item} />;
}

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Edit education entry</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EditEducationContent id={numericId} />
      </Suspense>
    </div>
  );
}
