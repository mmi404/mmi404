import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono-tag text-xs uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="font-display text-3xl text-primary">Page not found</h1>
      <p className="text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
      >
        Back home
      </Link>
    </div>
  );
}
