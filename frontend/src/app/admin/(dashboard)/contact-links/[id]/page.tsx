import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminGetContactLink } from "@/lib/admin-api";
import { ContactLinkForm } from "@/components/admin/contact-link-form";

async function EditContactLinkContent({ id }: { id: number }) {
  const item = await adminGetContactLink(id);
  if (!item) notFound();
  return <ContactLinkForm contactLink={item} />;
}

export default async function EditContactLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Edit contact link</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <EditContactLinkContent id={numericId} />
      </Suspense>
    </div>
  );
}
