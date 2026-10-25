import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminGetClubActivity } from "@/lib/admin-api";
import { ClubActivityForm } from "@/components/admin/club-activity-form";

async function EditClubActivityContent({ id }: { id: number }) {
  const item = await adminGetClubActivity(id);
  if (!item) notFound();
  return <ClubActivityForm clubActivity={item} />;
}

export default async function EditClubActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Edit club/activity entry</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EditClubActivityContent id={numericId} />
      </Suspense>
    </div>
  );
}
