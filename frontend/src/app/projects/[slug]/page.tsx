import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPrimaryPersona,
  getProjectDetail,
  withResolvedProjectMedia,
} from "@/lib/api";
import { ProjectDetailView } from "@/components/project-detail/project-detail-view";

async function loadProject(slug: string) {
  const persona = await getPrimaryPersona();
  if (!persona) return null;
  const project = await getProjectDetail(persona.slug, slug);
  if (!project) return null;
  return withResolvedProjectMedia(project);
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) {
    return { title: "Project not found" };
  }
  return {
    title: project.title,
    description: project.nontechnicalDescription ?? undefined,
  };
}

async function ProjectContent({
  params,
}: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.nontechnicalDescription ?? undefined,
    keywords: project.techTags.join(", "),
    ...(project.visibilityTier === "ADD" && project.liveUrl
      ? { url: project.liveUrl }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailView project={project} />
    </>
  );
}

function ProjectSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="h-10 w-2/3 animate-pulse rounded bg-surface-raised" />
      <div className="mt-6 h-20 w-full animate-pulse rounded bg-surface-raised" />
      <div className="mt-6 h-8 w-1/2 animate-pulse rounded bg-surface-raised" />
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}
