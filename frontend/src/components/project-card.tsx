"use client";

import { useState } from "react";
import Link from "next/link";
import { isAddProject, type Project } from "@/lib/api";
import { TechTagChips } from "@/components/tech-tag-chips";

/**
 * Every card renders at the same height regardless of a project's content:
 * the cover image sits in a fixed aspect-ratio box (with a labeled fallback
 * if there's no image or it fails to load, never a silently blank box), the
 * description is clamped to 2 lines, and the tag list is capped to
 * CARD_TAG_LIMIT with a "+N" overflow chip — otherwise a project with many
 * tech tags grows a second wrapped row and throws off the grid.
 */
const CARD_TAG_LIMIT = 4;

export function ProjectCard({ project }: { project: Project }) {
  const isAdd = isAddProject(project);
  const cover = isAdd ? project.images[0] : undefined;
  const hoverImage = isAdd ? project.images[1] : undefined;
  const [coverFailed, setCoverFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const showCover = cover && !coverFailed;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised transition-all duration-250 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {showCover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.imageUrl}
              alt={cover.caption ?? project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top"
              onError={() => setCoverFailed(true)}
            />
            {hoverImage && !hoverFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hoverImage.imageUrl}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100"
                onError={() => setHoverFailed(true)}
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-raised to-surface px-6 text-center">
            <span className="font-mono-tag text-[11px] uppercase tracking-wider text-muted">
              {isAdd ? "Screenshot coming soon" : "Confidential engagement"}
            </span>
            <span className="text-sm text-muted">No screenshots available</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg leading-snug text-primary">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-secondary">
          {project.nontechnicalDescription ?? "Description coming soon."}
        </p>
        <div className="mt-auto max-h-[52px] overflow-hidden">
          <TechTagChips tags={project.techTags} max={CARD_TAG_LIMIT} />
        </div>
      </div>
    </Link>
  );
}
