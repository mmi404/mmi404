import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getPersonaDetail,
  getPersonaProjects,
  getPrimaryPersona,
  withResolvedProjectMedia,
} from "@/lib/api";
import { Hero, HeroSkeleton } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const persona = await getPrimaryPersona();
  if (!persona) {
    return { title: "mmi404" };
  }
  return {
    // This is the root page, so the layout's "%s | mmi404" template does not
    // wrap it — write the full tab title here, not just a persona label.
    title: `mmi404 — ${persona.tagline}`,
    description: persona.tagline,
  };
}

async function HeroSection() {
  const persona = await getPrimaryPersona();
  if (!persona) {
    return (
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
        <EmptyState message="No persona has been published yet." />
      </section>
    );
  }
  const detail = await getPersonaDetail(persona.slug);
  return <Hero persona={persona} detail={detail} />;
}

async function ProjectGridSection() {
  const persona = await getPrimaryPersona();
  const projects = persona ? await getPersonaProjects(persona.slug) : [];
  const resolved = projects.map(withResolvedProjectMedia);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 pb-28">
      <Reveal className="mb-8">
        <h2 className="font-display text-2xl text-primary sm:text-3xl">
          Projects
        </h2>
      </Reveal>
      {resolved.length === 0 ? (
        <EmptyState message="No projects published yet — check back soon." />
      ) : (
        <ProjectGrid projects={resolved} />
      )}
    </section>
  );
}

function ProjectGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-surface-raised" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-raised"
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ProjectGridSkeleton />}>
        <ProjectGridSection />
      </Suspense>
    </>
  );
}
