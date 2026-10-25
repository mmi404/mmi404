import { API_BASE_URL } from "./config";

/**
 * Data fetching for the public backend API.
 *
 * Deliberately uncached (plain `fetch`, no `"use cache"`): this Next.js
 * version has Cache Components enabled (see next.config.ts), where a plain
 * `fetch` outside a `"use cache"` scope is request-time data. Every caller
 * of these functions must sit inside a <Suspense> boundary. We keep all
 * backend reads uncached for M5 rather than wrapping them in `"use cache"`,
 * because:
 *   1. The backend has no admin-triggered revalidation wired up yet
 *      (that's M6), so a cached copy could go stale with no way to bust it.
 *   2. CI builds the frontend without the backend running (see
 *      docs/architecture.md CI/CD section), and `"use cache"` functions are
 *      invoked during `next build` to try to produce a static shell — that
 *      would make `next build` depend on a live backend. Plain uncached
 *      fetches behind Suspense are never invoked at build time, so the
 *      build has no backend dependency.
 * This can be revisited once M6 ships on-demand revalidation.
 */

export class ApiUnavailableError extends Error {
  constructor(path: string, status?: number) {
    super(
      status
        ? `Backend API request to ${path} failed with status ${status}`
        : `Backend API request to ${path} failed (network error)`
    );
    this.name = "ApiUnavailableError";
  }
}

async function apiFetch<T>(path: string): Promise<T | null> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    console.error(`[api] network error fetching ${path}`, err);
    throw new ApiUnavailableError(path);
  }

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    console.error(`[api] ${path} responded with status ${res.status}`);
    throw new ApiUnavailableError(path, res.status);
  }

  return (await res.json()) as T;
}

/**
 * Resolve a possibly-relative media path returned by the backend into a URL
 * a browser can actually load. This deliberately does NOT use API_BASE_URL
 * (a server-to-server address, not reachable from a browser — see the
 * /media proxy route this rewrites into) and is safe to call from both
 * Server Components and "use client" code, unlike API_BASE_URL itself.
 */
export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `/media${path.startsWith("/") ? "" : "/"}${path}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Persona {
  slug: string;
  displayName: string;
  tagline: string;
  iconKey: string;
  navOrder: number;
}

export interface PersonaDetail extends Persona {
  headline: string;
  introMarkdown: string;
}

export interface ProjectImage {
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

interface ProjectCommon {
  slug: string;
  title: string;
  // Nullable on the backend (no @NotBlank/@NotNull on ProjectUpsertRequest)
  // — an admin can save a project before filling these in. M5 originally
  // typed these as non-nullable `string` on the (incorrect) assumption that
  // seed data always has them filled; M6 letting admins create projects
  // without them surfaced the gap (a real project with a null
  // technicalDescription crashed Markdown's `.split()` once revealed).
  nontechnicalDescription: string | null;
  technicalDescription: string | null;
  experienceDescription: string | null;
  techTags: string[];
}

export interface ProjectAdd extends ProjectCommon {
  visibilityTier: "ADD";
  liveUrl: string | null;
  githubUrl: string | null;
  clientName: string | null;
  images: ProjectImage[];
}

export interface ProjectPartial extends ProjectCommon {
  visibilityTier: "PARTIAL";
}

export type Project = ProjectAdd | ProjectPartial;

export function isAddProject(project: Project): project is ProjectAdd {
  return project.visibilityTier === "ADD";
}

export interface EducationItem {
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

export interface ContactLink {
  label: string;
  url: string;
  iconKey?: string | null;
}

export interface Profile {
  fullName: string | null;
  headline: string | null;
  aboutMeMarkdown: string | null;
  profilePhotoUrl: string | null;
  resumeUrl: string | null;
  education: EducationItem[];
  contactLinks: ContactLink[];
}

const EMPTY_PROFILE: Profile = {
  fullName: null,
  headline: null,
  aboutMeMarkdown: null,
  profilePhotoUrl: null,
  resumeUrl: null,
  education: [],
  contactLinks: [],
};

// ---------------------------------------------------------------------------
// Public API calls
// ---------------------------------------------------------------------------

export async function getPersonas(): Promise<Persona[]> {
  const personas = await apiFetch<Persona[]>("/api/personas");
  return personas ?? [];
}

/**
 * The backend currently returns exactly one persona. This helper reads the
 * array's length rather than assuming "there is exactly one persona" so a
 * future second persona doesn't require touching every call site — only the
 * UI that should branch into a switcher (none exists yet, intentionally).
 */
export async function getPrimaryPersona(): Promise<Persona | null> {
  const personas = await getPersonas();
  return personas[0] ?? null;
}

export async function getPersonaDetail(
  slug: string
): Promise<PersonaDetail | null> {
  return apiFetch<PersonaDetail>(`/api/personas/${encodeURIComponent(slug)}`);
}

export async function getPersonaProjects(slug: string): Promise<Project[]> {
  const projects = await apiFetch<Project[]>(
    `/api/personas/${encodeURIComponent(slug)}/projects`
  );
  return projects ?? [];
}

export async function getProjectDetail(
  personaSlug: string,
  projectSlug: string
): Promise<Project | null> {
  return apiFetch<Project>(
    `/api/personas/${encodeURIComponent(personaSlug)}/projects/${encodeURIComponent(
      projectSlug
    )}`
  );
}

export async function getProfile(): Promise<Profile> {
  const profile = await apiFetch<Profile>("/api/profile");
  return profile ?? EMPTY_PROFILE;
}

// ---------------------------------------------------------------------------
// Media resolution helpers (apply after fetching, before handing to Client Components)
// ---------------------------------------------------------------------------

export function withResolvedProjectMedia<T extends Project>(project: T): T {
  if (isAddProject(project)) {
    return {
      ...project,
      images: project.images.map((img) => ({
        ...img,
        imageUrl: resolveMediaUrl(img.imageUrl) ?? img.imageUrl,
      })),
    };
  }
  return project;
}

export function withResolvedProfileMedia(profile: Profile): Profile {
  return {
    ...profile,
    profilePhotoUrl: resolveMediaUrl(profile.profilePhotoUrl),
  };
}
