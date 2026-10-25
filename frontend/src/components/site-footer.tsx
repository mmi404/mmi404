import Link from "next/link";

// Static copyright year: `new Date()` is a sync-IO call that Cache
// Components treats as a per-request value and would block this
// (unsuspended, always-static) footer from prerendering. This is a footer
// string, not a correctness-critical timestamp, so it's hardcoded and
// bumped manually.
const COPYRIGHT_YEAR = 2026;

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {COPYRIGHT_YEAR} mmi404.</p>
        <nav className="flex items-center gap-5">
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/#projects" className="transition-colors hover:text-accent">
            Projects
          </Link>
          <Link href="/about" className="transition-colors hover:text-accent">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
