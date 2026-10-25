import Link from "next/link";
import { isAddProject, type Project } from "@/lib/api";
import { TechTagChips } from "@/components/tech-tag-chips";

/**
 * Pure presentational card. The hover crossfade (ADD, 2+ images) and the
 * lift+shadow are both plain CSS (group-hover), so this component needs no
 * client-side JS or state of its own — it's rendered inside the client
 * <ProjectGrid> purely so it can participate in that grid's stagger
 * animation, not because it has any interactivity itself.
 */
export function ProjectCard({ project }: { project: Project }) {
  const isAdd = isAddProject(project);
  const cover = isAdd ? project.images[0] : undefined;
  const hoverImage = isAdd ? project.images[1] : undefined;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised transition-all duration-250 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.imageUrl}
              alt={cover.caption ?? project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {hoverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hoverImage.imageUrl}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-raised to-surface px-6 text-center">
            <span className="font-mono-tag text-[11px] uppercase tracking-wider text-muted">
              Confidential engagement
            </span>
            <span className="text-sm text-muted">No screenshots available</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-display text-lg leading-snug text-primary">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-secondary">
          {project.nontechnicalDescription ?? "Description coming soon."}
        </p>
        <TechTagChips tags={project.techTags} />
      </div>
    </Link>
  );
}
