import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminGetPersona } from "@/lib/admin-api";
import { PersonaForm } from "@/components/admin/persona-form";

async function EditPersonaContent({ id }: { id: number }) {
  const persona = await adminGetPersona(id);
  if (!persona) notFound();
  return <PersonaForm persona={persona} />;
}

export default async function EditPersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Edit persona</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EditPersonaContent id={numericId} />
      </Suspense>
    </div>
  );
}
