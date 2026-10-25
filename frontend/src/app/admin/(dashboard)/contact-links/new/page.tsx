import { ContactLinkForm } from "@/components/admin/contact-link-form";

export default function NewContactLinkPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">New contact link</h1>
      <ContactLinkForm />
    </div>
  );
}
