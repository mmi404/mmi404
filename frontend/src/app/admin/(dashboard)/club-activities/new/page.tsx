import { ClubActivityForm } from "@/components/admin/club-activity-form";

export default function NewClubActivityPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">New club/activity entry</h1>
      <ClubActivityForm />
    </div>
  );
}
