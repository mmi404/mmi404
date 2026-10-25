// Types for the backend's /api/admin/** contract. Field names/shapes
// confirmed by reading the backend controllers/DTOs directly, not guessed.

export interface AdminPersona {
  id: number;
  slug: string;
  displayName: string;
  tagline: string | null;
  iconKey: string | null;
  navOrder: number;
  published: boolean;
  headline: string | null;
  introMarkdown: string | null;
}

export interface AdminPersonaUpsert {
  slug: string;
  displayName: string;
  tagline?: string | null;
  iconKey?: string | null;
  navOrder: number;
  published: boolean;
  headline?: string | null;
  introMarkdown?: string | null;
}

export interface AdminSiteProfile {
  id: number;
  fullName: string;
  headline: string | null;
  aboutMeMarkdown: string | null;
  profilePhotoUrl: string | null;
  resumeUrl: string | null;
}

export interface AdminSiteProfileUpsert {
  fullName: string;
  headline?: string | null;
  aboutMeMarkdown?: string | null;
  profilePhotoUrl?: string | null;
  resumeUrl?: string | null;
}

export interface AdminEducation {
  id: number;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  sortOrder: number;
}

export type AdminEducationUpsert = Omit<AdminEducation, "id">;

export interface AdminClubActivity {
  id: number;
  name: string;
  role: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
}

export type AdminClubActivityUpsert = Omit<AdminClubActivity, "id">;

export interface AdminContactLink {
  id: number;
  label: string;
  url: string;
  iconKey: string | null;
  sortOrder: number;
}

export type AdminContactLinkUpsert = Omit<AdminContactLink, "id">;

export interface AdminTechTag {
  id: number;
  name: string;
  slug: string;
}

export type AdminTechTagUpsert = Omit<AdminTechTag, "id">;

export type VisibilityTier = "ADD" | "PARTIAL";

export interface AdminProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface AdminProject {
  id: number;
  personaId: number;
  slug: string;
  title: string;
  visibilityTier: VisibilityTier;
  nontechnicalDescription: string | null;
  technicalDescription: string | null;
  experienceDescription: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  clientName: string | null;
  sortOrder: number;
  published: boolean;
  techTags: AdminTechTag[];
  images: AdminProjectImage[];
}

export interface AdminProjectUpsert {
  personaId: number;
  slug: string;
  title: string;
  visibilityTier: VisibilityTier;
  nontechnicalDescription?: string | null;
  technicalDescription?: string | null;
  experienceDescription?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  clientName?: string | null;
  sortOrder: number;
  published: boolean;
  techTagIds?: number[];
}

export interface AdminContactMessage {
  id: number;
  messageBody: string;
  replyEmail: string | null;
  replyPhone: string | null;
  ipAddress: string;
  userAgent: string | null;
  read: boolean;
  submittedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
