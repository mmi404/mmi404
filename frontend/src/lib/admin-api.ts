import "server-only";
import { cookies } from "next/headers";
import { API_BASE_URL } from "./config";
import { ADMIN_TOKEN_COOKIE } from "./admin-auth";
import type {
  AdminClubActivity,
  AdminContactLink,
  AdminContactMessage,
  AdminEducation,
  AdminPersona,
  AdminProject,
  AdminSiteProfile,
  AdminTechTag,
  Page,
} from "./admin-types";

/**
 * Server-side reads for admin pages (Server Components only — this file
 * imports "server-only" and `next/headers`, so it can't be pulled into a
 * client bundle). Fetches the backend directly rather than round-tripping
 * through our own /api/admin proxy, per Next's own guidance ("fetch data in
 * Server Components directly from its source, not via Route Handlers").
 * Mutations from client components (forms, uploads, login/logout) go through
 * `/api/admin/[...path]/route.ts` instead, since those originate in the
 * browser and need that same-origin proxy to avoid the backend's CORS gap.
 *
 * Uncached on purpose, same reasoning as src/lib/api.ts: admin data changes
 * constantly and there's no revalidation hook wired up, so every admin page
 * wraps its data-fetching section in <Suspense> and never caches.
 */

async function authCookieHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  return token ? { Cookie: `${ADMIN_TOKEN_COOKIE}=${token}` } : {};
}

export class AdminApiError extends Error {
  status: number;
  constructor(path: string, status: number) {
    super(`Admin API request to ${path} failed with status ${status}`);
    this.name = "AdminApiError";
    this.status = status;
  }
}

async function adminFetch<T>(path: string): Promise<T | null> {
  const headers = await authCookieHeader();
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json", ...headers },
    });
  } catch (err) {
    console.error(`[admin-api] network error fetching ${path}`, err);
    throw new AdminApiError(path, 0);
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new AdminApiError(path, res.status);
  return (await res.json()) as T;
}

export async function adminGetPersonas(): Promise<AdminPersona[]> {
  return (await adminFetch<AdminPersona[]>("/api/admin/personas")) ?? [];
}

export async function adminGetPersona(id: number): Promise<AdminPersona | null> {
  return adminFetch<AdminPersona>(`/api/admin/personas/${id}`);
}

export async function adminGetSiteProfile(): Promise<AdminSiteProfile | null> {
  return adminFetch<AdminSiteProfile>("/api/admin/site-profile");
}

export async function adminGetEducationList(): Promise<AdminEducation[]> {
  return (await adminFetch<AdminEducation[]>("/api/admin/education")) ?? [];
}

export async function adminGetEducation(id: number): Promise<AdminEducation | null> {
  return adminFetch<AdminEducation>(`/api/admin/education/${id}`);
}

export async function adminGetClubActivities(): Promise<AdminClubActivity[]> {
  return (await adminFetch<AdminClubActivity[]>("/api/admin/club-activities")) ?? [];
}

export async function adminGetClubActivity(id: number): Promise<AdminClubActivity | null> {
  return adminFetch<AdminClubActivity>(`/api/admin/club-activities/${id}`);
}

export async function adminGetContactLinks(): Promise<AdminContactLink[]> {
  return (await adminFetch<AdminContactLink[]>("/api/admin/contact-links")) ?? [];
}

export async function adminGetContactLink(id: number): Promise<AdminContactLink | null> {
  return adminFetch<AdminContactLink>(`/api/admin/contact-links/${id}`);
}

export async function adminGetTechTags(): Promise<AdminTechTag[]> {
  return (await adminFetch<AdminTechTag[]>("/api/admin/tech-tags")) ?? [];
}

export async function adminGetTechTag(id: number): Promise<AdminTechTag | null> {
  return adminFetch<AdminTechTag>(`/api/admin/tech-tags/${id}`);
}

export async function adminGetProjects(): Promise<AdminProject[]> {
  return (await adminFetch<AdminProject[]>("/api/admin/projects")) ?? [];
}

export async function adminGetProject(id: number): Promise<AdminProject | null> {
  return adminFetch<AdminProject>(`/api/admin/projects/${id}`);
}

export async function adminGetContactMessages(params: {
  page?: number;
  size?: number;
  isRead?: boolean;
}): Promise<Page<AdminContactMessage>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 20));
  search.set("sort", "submittedAt,desc");
  if (params.isRead !== undefined) search.set("isRead", String(params.isRead));
  const result = await adminFetch<Page<AdminContactMessage>>(
    `/api/admin/contact-messages?${search.toString()}`
  );
  return (
    result ?? {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: params.size ?? 20,
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true,
    }
  );
}

export async function adminGetContactMessage(
  id: number
): Promise<AdminContactMessage | null> {
  return adminFetch<AdminContactMessage>(`/api/admin/contact-messages/${id}`);
}
