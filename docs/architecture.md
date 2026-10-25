# Architecture

This is the working architecture reference for the mmi404 multi-persona portfolio. It mirrors the implementation plan approved at project kickoff; update it as decisions evolve during the build rather than letting it drift out of sync with the code.

## Overview

- **Backend:** Spring Boot 4 (Java 21) REST API, MySQL via Flyway migrations.
- **Frontend:** Next.js (App Router, TypeScript) — separate service, consumes the backend API.
- **Containerization:** Docker, multi-stage builds for both services.
- **CI/CD:** GitHub Actions — build/test on PRs, build+push to GHCR and SSH-deploy on `main`.
- **Deployment:** VPS, Caddy reverse proxy/TLS, root domain `mmi404.com` + `www.mmi404.com`.

## Repo layout

```
mmi404/
├── backend/          # Spring Boot — see package breakdown below
├── frontend/         # Next.js App Router
├── docker/           # docker-compose.dev.yml, docker-compose.prod.yml, caddy/Caddyfile
├── .github/workflows/
├── docs/architecture.md   # this file
└── plan/My-Development-Portfolio.md   # LOCAL ONLY, gitignored — contains the real, unredacted
                                       # names behind the PARTIAL-tier projects; used as the
                                       # seed-data source but must never be committed
```

## Data model (MySQL, Flyway-managed)

**Person-level / global** (shared across all personas):
```
persona(id, slug UNIQUE, display_name, tagline, icon_key, nav_order, is_published, created_at, updated_at)
persona_profile(id, persona_id FK UNIQUE, headline, intro_markdown, created_at, updated_at)
site_profile(id, full_name, headline, about_me_markdown, profile_photo_url, resume_url, created_at, updated_at)  -- singleton
education(id, institution, degree, field_of_study, start_date, end_date, description, sort_order)
club_activity(id, name, role, description, start_date, end_date, sort_order)
contact_link(id, label, url, icon_key, sort_order)
```
Global facts (education, contact links, bio) live once, not duplicated per persona — only the per-persona *framing* (`persona_profile.headline`/`intro_markdown`) differs.

**Developer persona** (the only one populated at launch):
```
project(id, persona_id FK, slug UNIQUE, title,
        visibility_tier ENUM('ADD','PARTIAL') NOT NULL,   -- IGNORE tier = row never created
        nontechnical_description TEXT, technical_description TEXT, experience_description TEXT,
        live_url VARCHAR(500), github_url VARCHAR(500), client_name VARCHAR(150),
        sort_order, is_published, created_at, updated_at)
project_image(id, project_id FK ON DELETE CASCADE, image_url, caption, sort_order)
tech_tag(id, name UNIQUE, slug UNIQUE)
project_tech_tag(project_id FK, tech_tag_id FK, PRIMARY KEY(project_id, tech_tag_id))
admin_user(id, username UNIQUE, password_hash, created_at, last_login_at)
```

**Contact messaging:**
```
contact_message(id, message_body VARCHAR(5000) NOT NULL,
                 reply_email VARCHAR(255), reply_phone VARCHAR(50),   -- both optional
                 ip_address VARCHAR(45) NOT NULL, user_agent VARCHAR(500),
                 is_read BOOLEAN NOT NULL DEFAULT FALSE,
                 submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                 INDEX(submitted_at), INDEX(is_read))
```
`ip_address`/`user_agent` are derived server-side from the request, never accepted as client-supplied fields — nothing for a caller to spoof via the POST body.

### Enforcing PARTIAL-tier confidentiality (two independent layers)

1. **DB CHECK constraint:** `visibility_tier <> 'PARTIAL' OR (live_url IS NULL AND github_url IS NULL AND client_name IS NULL)` — a bad write fails loudly instead of silently persisting.
2. **API layer (the one that actually matters):** two distinct response DTOs branched by `visibility_tier` through one `ProjectMapper` chokepoint — `ProjectAddResponse` (has `liveUrl`/`githubUrl`) vs `ProjectPartialResponse` (structurally has no such fields at all). PARTIAL projects also get zero `project_image` rows, enforced by rejecting image uploads server-side when `tier == PARTIAL`.

### Adding a future persona

Insert a `persona` + `persona_profile` row, then add a small new migration for that persona's own content shape (e.g. `photo_album`/`photo` for photography, `publication` for academic work) plus a matching backend package and frontend route, mirroring the `developer/` pattern. Deliberately not a speculative universal content schema — different personas' content genuinely differs in shape.

### Migration sequence

V1 persona → V2 site_profile/education/contact_link → V3 admin_user (schema only, no seeded credentials) → V4 tech_tag → V5 project/project_image + CHECK constraint → V6 seed developer persona → V7 seed the 8 ADD + 4 PARTIAL projects from `plan/My-Development-Portfolio.md` → V8 contact_message.

Admin credentials are bootstrapped at runtime from `ADMIN_BOOTSTRAP_USERNAME`/`ADMIN_BOOTSTRAP_PASSWORD` env vars via a `CommandLineRunner` (only if `admin_user` is empty) — never checked into a migration.

## Backend

Package-per-domain under `com.mmi404.portfolio`: `persona/`, `profile/`, `developer/project/`, `contact/`, `auth/`, `image/`, `config/`, `common/`.

**Public API:** `GET /api/personas`, `/api/personas/{slug}`, `/api/personas/{slug}/projects`, `/api/personas/{slug}/projects/{projectSlug}`, `/api/profile`, `POST /api/contact-messages` (unauthenticated).

**Admin API** (`/api/admin/**`, JWT-secured): auth login, CRUD on personas/profile/education/contact-links/projects/project-images/tech-tags, `GET/PATCH /api/admin/contact-messages`.

**Auth:** JWT in an httpOnly secure cookie, short expiry. No OAuth2/OIDC flow needed (single admin login), so this skips the session+Redis pattern used by other projects in favor of one fewer infra dependency.

**Image storage:** local disk volume, served via a static resource handler. Revisit if/when the photography persona brings real image volume.

**Contact-message abuse protection:** Bucket4j rate limiting keyed by resolved client IP (e.g. 5/hour), bean validation (`@NotBlank @Size(max=5000)`, `@Email` on optional reply-email), server-side sanitization via `Jsoup.clean(..., Safelist.none())` before persisting, plus a honeypot field. `server.forward-headers-strategy=framework` so the real client IP resolves correctly behind Caddy.

## Frontend

Next.js App Router: `app/(public)/[personaSlug]/page.tsx`, `.../projects/[projectSlug]/page.tsx`, `app/about/page.tsx` (bio/education/contact + public contact form), `app/admin/**` (login, dashboard, CRUD, messages inbox), protected by `middleware.ts`, `noindex`'d.

Admin UI lives in the same Next.js app — the real security boundary is the JWT-secured API, not which bundle renders the HTML.

SEO: Server Components, ISR-style revalidation, `generateMetadata` per route, JSON-LD, static `llms.txt`.

> **Open item for implementation:** this scaffold generated on Next.js 16.4 with `cacheComponents`/`partialPrefetching` enabled in `next.config.ts` — a caching model newer than the "ISR via `revalidate`" pattern used on earlier sibling projects. Read `frontend/node_modules/next/dist/docs/01-app/02-guides` (caching/`use cache` directive) before implementing data fetching in M5, and confirm whether to keep `cacheComponents` on or disable it for a simpler mental model.

## Docker & Compose

Services: `mysql`, `backend`, `frontend`, `caddy` (prod only). Separate `docker-compose.dev.yml` / `docker-compose.prod.yml` files (not profiles). Multi-stage Dockerfiles, non-root runtime users.

## CI/CD

`ci.yml` on PRs + `main`: backend `mvn verify`, frontend `lint && build`, PR-only `docker build` check (no push/deploy on PRs). `build-push.yml`/`deploy.yml` on `main` only: build + push to GHCR → SSH deploy → health-check gate (Spring Actuator + frontend root).

Repo secrets: `VPS_HOST`, `VPS_SSH_USER`, `VPS_SSH_PRIVATE_KEY`, `VPS_SSH_PORT` (if non-default). GHCR push uses the built-in `GITHUB_TOKEN`.

## Milestones

| # | Milestone | Blocks on client? |
|---|---|---|
| M1 | Repo scaffold, dev compose w/ MySQL | No |
| M2 | Flyway V1–V7, seed 12 developer projects | No |
| M3 | Backend public API, ADD/PARTIAL DTO split verified | No |
| M4 | Backend admin API + JWT auth + image upload | Pick an admin username |
| M4.5 | Contact messaging (V8, public endpoint, admin inbox) | No |
| M5 | Frontend public pages + public contact form | Real About/education/contact copy |
| M6 | Frontend admin UI | No |
| M7 | Dockerfiles + full local compose smoke test | No |
| M8 | GitHub Actions CI | No |
| M9 | CD to VPS | VPS SSH access/secrets, DNS |
| M10 | Profile photo bg removal + content polish | Repo visibility/link confirmations, final bio text |
