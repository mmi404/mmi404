import { Suspense } from "react";
import type { Metadata } from "next";
import { getProfile, withResolvedProfileMedia, type Profile } from "@/lib/api";
import { Markdown } from "@/components/markdown";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Bio, education, and contact.",
};

const PLACEHOLDER_PHOTO = "/profile-placeholder.png";

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return null;
  const fmt = (d: string) => {
    const parsed = new Date(d);
    if (Number.isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };
  const startLabel = start ? fmt(start) : "?";
  const endLabel = end ? fmt(end) : "Present";
  return `${startLabel} — ${endLabel}`;
}

function AboutContent({ profile }: { profile: Profile }) {
  const photo = profile.profilePhotoUrl ?? PLACEHOLDER_PHOTO;
  const isPlaceholderPhoto = !profile.profilePhotoUrl;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName ?? "Portfolio owner",
    ...(profile.headline ? { jobTitle: profile.headline } : {}),
    ...(profile.aboutMeMarkdown ? { description: profile.aboutMeMarkdown } : {}),
    ...(profile.contactLinks.length > 0
      ? { sameAs: profile.contactLinks.map((l) => l.url) }
      : {}),
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border-subtle bg-surface-raised">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={profile.fullName ?? "Profile photo"}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-display text-3xl text-primary">
            {profile.fullName ?? "Name coming soon"}
          </h1>
          <p className="mt-1 text-secondary">
            {profile.headline ?? "Headline coming soon."}
          </p>
          {isPlaceholderPhoto && (
            <p className="mt-1 text-xs italic text-muted">
              Placeholder photo — to be replaced.
            </p>
          )}
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-display text-xl text-primary">About</h2>
        {profile.aboutMeMarkdown ? (
          <Markdown
            content={profile.aboutMeMarkdown}
            className="mt-3 max-w-2xl text-base leading-relaxed text-secondary [&>p]:mb-4 last:[&>p]:mb-0"
          />
        ) : (
          <p className="mt-3 italic text-muted">Bio coming soon.</p>
        )}
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Download resume
          </a>
        )}
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-display text-xl text-primary">Education</h2>
        {profile.education.length === 0 ? (
          <p className="mt-3 italic text-muted">Education details coming soon.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {profile.education.map((item, i) => (
              <li key={i} className="border-l-2 border-border-subtle pl-4">
                <p className="font-medium text-primary">
                  {item.degree}
                  {item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ""}
                </p>
                <p className="text-sm text-secondary">{item.institution}</p>
                {formatDateRange(item.startDate, item.endDate) && (
                  <p className="text-xs text-muted">
                    {formatDateRange(item.startDate, item.endDate)}
                  </p>
                )}
                {item.description && (
                  <p className="mt-1 text-sm text-secondary">{item.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-display text-xl text-primary">Connect</h2>
        {profile.contactLinks.length === 0 ? (
          <p className="mt-3 italic text-muted">Links coming soon.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-3">
            {profile.contactLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border-subtle px-4 py-2 text-sm text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Reveal>

      <Reveal className="mt-10 border-t border-border-subtle pt-10">
        <h2 className="font-display text-xl text-primary">Get in touch</h2>
        <p className="mt-2 max-w-xl text-sm text-secondary">
          Have a project in mind or just want to say hello? Send a message below.
        </p>
        <div className="mt-5 max-w-xl">
          <ContactForm />
        </div>
      </Reveal>
    </div>
  );
}

async function AboutSection() {
  const profile = withResolvedProfileMedia(await getProfile());
  return <AboutContent profile={profile} />;
}

function AboutSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center gap-6">
        <div className="h-28 w-28 animate-pulse rounded-full bg-surface-raised" />
        <div className="flex-1">
          <div className="h-8 w-48 animate-pulse rounded bg-surface-raised" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface-raised" />
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutSection />
    </Suspense>
  );
}
