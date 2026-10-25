import { isAddProject, type Project } from "@/lib/api";
import { TechTagChips } from "@/components/tech-tag-chips";
import { Markdown } from "@/components/markdown";
import { OverviewToggle } from "@/components/project-detail/overview-toggle";
import { ImageGallery } from "@/components/project-detail/image-gallery";
import { Reveal } from "@/components/motion/reveal";

export function ProjectDetailView({ project }: { project: Project }) {
  const isAdd = isAddProject(project);

  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        {!isAdd && (
          <p className="font-mono-tag mb-3 inline-block rounded-full border border-border-subtle px-3 py-1 text-[11px] uppercase tracking-wider text-muted">
            Confidential engagement
          </p>
        )}
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-primary">
          {project.title}
        </h1>
        {isAdd && project.clientName && (
          <p className="mt-2 text-sm text-muted">Built for {project.clientName}</p>
        )}

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary">
          {project.nontechnicalDescription ?? "Description coming soon."}
        </p>

        <div className="mt-5">
          <TechTagChips tags={project.techTags} size="md" />
        </div>

        {isAdd && (project.liveUrl || project.githubUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
              >
                View live site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
              >
                View source
              </a>
            )}
          </div>
        )}
      </Reveal>

      <div className="mt-10 border-t border-border-subtle pt-10">
        <OverviewToggle
          technicalContent={
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-lg text-primary">
                  Technical details
                </h2>
                {project.technicalDescription ? (
                  <Markdown
                    content={project.technicalDescription}
                    className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary [&>p]:mb-3 last:[&>p]:mb-0"
                  />
                ) : (
                  <p className="mt-2 italic text-muted">
                    Technical details coming soon.
                  </p>
                )}
              </div>
              {project.experienceDescription && (
                <div>
                  <h2 className="font-display text-lg text-primary">
                    My role &amp; experience
                  </h2>
                  <Markdown
                    content={project.experienceDescription}
                    className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary [&>p]:mb-3 last:[&>p]:mb-0"
                  />
                </div>
              )}
            </div>
          }
        />
      </div>

      {isAdd && project.images.length > 0 && (
        <Reveal className="mt-12 border-t border-border-subtle pt-10">
          <h2 className="font-display mb-5 text-lg text-primary">Gallery</h2>
          <ImageGallery images={project.images} />
        </Reveal>
      )}
    </article>
  );
}
