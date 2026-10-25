import type { Metadata } from "next";

/**
 * Opts every /admin/** route out of Cache Components' static-shell
 * validation (the build-time check that each route produces a non-empty
 * prerendered shell). Admin pages are entirely auth-gated and read
 * per-request cookies/session data everywhere, so there's no static shell
 * to produce or benefit from — unlike the public pages, instant navigation
 * isn't a goal here. Setting `false` on this top-level layout covers every
 * admin page/layout beneath it (including the (dashboard) group and the
 * login page) without needing it repeated on each one.
 */
export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | mmi404 Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * Shared by every /admin/** route (login included). Deliberately not reusing
 * the public SiteHeader/SiteFooter or the public design tokens — see the
 * `.admin-shell` comment in globals.css. The nav/logout chrome for
 * authenticated screens lives one level down, in
 * app/admin/(dashboard)/layout.tsx, so the login page itself stays chrome-free.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="admin-shell min-h-screen">{children}</div>;
}
