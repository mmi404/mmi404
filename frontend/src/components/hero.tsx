import Link from "next/link";
import type { Persona, PersonaDetail } from "@/lib/api";
import { Markdown } from "@/components/markdown";
import { HeroReveal } from "@/components/motion/hero-reveal";

export function Hero({
  persona,
  detail,
}: {
  persona: Persona;
  detail: PersonaDetail | null;
}) {
  const headline = detail?.headline ?? persona.tagline;
  const intro = detail?.introMarkdown;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-20 sm:pt-28">
      <HeroReveal
        items={[
          <h1
            key="headline"
            className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] text-primary"
          >
            {headline}
          </h1>,
          intro ? (
            <Markdown
              key="intro"
              content={intro}
              className="max-w-2xl text-base leading-relaxed text-secondary [&>p]:mb-4 last:[&>p]:mb-0"
            />
          ) : (
            <p key="intro-fallback" className="max-w-2xl text-base italic text-muted">
              Introduction coming soon.
            </p>
          ),
        ]}
      />
      <div className="flex flex-wrap gap-4 pt-2">
        <Link
          href="#projects"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
        >
          View projects
        </Link>
        <Link
          href="/about"
          className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
        >
          About &amp; contact
        </Link>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-20 sm:pt-28">
      <div className="h-12 w-3/4 animate-pulse rounded bg-surface-raised" />
      <div className="h-20 w-full max-w-2xl animate-pulse rounded bg-surface-raised" />
    </section>
  );
}
