import Link from "next/link";

const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/personas", label: "Personas" },
  { href: "/admin/site-profile", label: "Site Profile" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/club-activities", label: "Club Activities" },
  { href: "/admin/contact-links", label: "Contact Links" },
  { href: "/admin/tech-tags", label: "Tech Tags" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-1 text-sm">
      {SECTIONS.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
        >
          {s.label}
        </Link>
      ))}
    </nav>
  );
}
