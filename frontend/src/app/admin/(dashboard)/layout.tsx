import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

/**
 * Nav/logout chrome for every authenticated admin screen. This route group
 * ((dashboard)) doesn't affect URLs — /admin, /admin/projects, etc. all
 * render through this layout, while /admin/login (outside the group) does
 * not, so the login form has no nav bar to flash before redirecting.
 */
export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-900">
              mmi404 Admin
            </span>
            <AdminNav />
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
