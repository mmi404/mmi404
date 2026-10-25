import Link from "next/link";

const CARDS = [
  { href: "/admin/personas", title: "Personas", desc: "Persona identity + headline/intro copy" },
  { href: "/admin/site-profile", title: "Site Profile", desc: "Name, bio, resume, photo (singleton)" },
  { href: "/admin/education", title: "Education", desc: "Education history entries" },
  {
    href: "/admin/club-activities",
    title: "Club Activities",
    desc: "Clubs, societies, and extracurricular involvement",
  },
  { href: "/admin/contact-links", title: "Contact Links", desc: "Social/contact links on the About page" },
  { href: "/admin/tech-tags", title: "Tech Tags", desc: "Shared tag list used on projects" },
  { href: "/admin/projects", title: "Projects", desc: "Project content, tiers, and images" },
  { href: "/admin/messages", title: "Messages", desc: "Contact form inbox" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a section to manage its content.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm"
          >
            <h2 className="font-medium text-slate-900">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
