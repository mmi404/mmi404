import { Suspense } from "react";
import { adminGetSiteProfile } from "@/lib/admin-api";
import { SiteProfileForm } from "@/components/admin/site-profile-form";

async function SiteProfileContent() {
  // GET 404s until the profile has been saved once — that's expected for a
  // singleton resource, not an error state. Render the form with blanks.
  const profile = await adminGetSiteProfile();
  return <SiteProfileForm profile={profile} />;
}

export default function SiteProfilePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Site Profile</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <SiteProfileContent />
      </Suspense>
    </div>
  );
}
