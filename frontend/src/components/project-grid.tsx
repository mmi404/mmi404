"use client";

import type { Project } from "@/lib/api";
import { ProjectCard } from "@/components/project-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <RevealItem key={project.slug}>
          <ProjectCard project={project} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
