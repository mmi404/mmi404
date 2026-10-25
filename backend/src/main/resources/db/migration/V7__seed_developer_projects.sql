-- ============================================================================
-- Tech tags (deduplicated across all ADD + PARTIAL developer-persona projects)
-- ============================================================================
INSERT INTO tech_tag (name, slug) VALUES
    ('Java', 'java'),
    ('Spring Boot', 'spring-boot'),
    ('Spring Security', 'spring-security'),
    ('PostgreSQL', 'postgresql'),
    ('MySQL', 'mysql'),
    ('Redis', 'redis'),
    ('Flyway', 'flyway'),
    ('Bucket4j', 'bucket4j'),
    ('Next.js', 'nextjs'),
    ('React', 'react'),
    ('TypeScript', 'typescript'),
    ('Tailwind CSS', 'tailwind-css'),
    ('shadcn/ui', 'shadcn-ui'),
    ('TanStack Query', 'tanstack-query'),
    ('Docker', 'docker'),
    ('GitHub Actions', 'github-actions'),
    ('Prometheus', 'prometheus'),
    ('Sentry', 'sentry'),
    ('AWS S3', 'aws-s3'),
    ('CSS Modules', 'css-modules'),
    ('JavaScript', 'javascript'),
    ('Vanilla JavaScript', 'vanilla-javascript'),
    ('Firebase', 'firebase'),
    ('Firestore', 'firestore'),
    ('Framer Motion', 'framer-motion'),
    ('Flutter', 'flutter'),
    ('Dart', 'dart'),
    ('Node.js', 'nodejs'),
    ('Socket.io', 'socketio'),
    ('MongoDB', 'mongodb'),
    ('Elasticsearch', 'elasticsearch'),
    ('MinIO', 'minio'),
    ('Nginx', 'nginx'),
    ('Uwazi', 'uwazi'),
    ('GSAP', 'gsap');

-- ============================================================================
-- ADD tier — 8 full-showcase projects
-- ============================================================================
INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'reformcuet', 'CUETians'' Voice', 'ADD',
    'A campus community platform for CUET (Chittagong University of Engineering & Technology). Students and teachers sign in with their university Google account to post problems and proposed solutions; the community votes, the Dean of Students'' Welfare (DSW) office resolves issues, and the reporting student confirms resolution. Also has polling and push notifications.',
    'Full-stack monorepo — the most mature/production-grade project in the whole portfolio. Backend: Java 21, Spring Boot 3.5, Spring Security OAuth2/OIDC (Google), Spring Session + Redis, PostgreSQL 16 + Flyway, Bucket4j rate limiting, Micrometer/Prometheus, Sentry, AWS S3, Web Push. Frontend: Next.js 16.3, React 19, TypeScript, TanStack Query, react-hook-form + zod, Tailwind + shadcn/Radix, DOMPurify, Cloudflare Turnstile. Infra: Docker Compose, GitHub Actions CI/CD (build -> GHCR -> SSH deploy, health-gated), Grafana/Prometheus monitoring, Testcontainers integration tests, contract-first OpenAPI spec.',
    NULL,
    'https://cuetiansvoice.mmi404.com', NULL, NULL, 1, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'modelmate', 'ModelMate', 'ADD',
    'A community review platform for AI models — browse and search models by category, write multi-criteria reviews and "problem reports," compare two models head-to-head, and see a review-weighted leaderboard.',
    'Next.js 16.3 + TypeScript + Tailwind v4 + Radix/shadcn + TanStack Query frontend; Spring Boot 3.4 (Java 21) + Spring Security JWT + JPA + Flyway + Bucket4j + springdoc-openapi backend; PostgreSQL 16 with pg_trgm for search. Dockerized, GitHub Actions CI/CD to GHCR, deployed behind Caddy on a VPS. SEO/GEO-optimized (SSR, JSON-LD, even an llms.txt for LLM crawlers). Started as a university "IP lab" coursework proposal and evolved into a real deployed product through multiple redesigns.',
    NULL,
    'https://modelmate.mmi404.com', 'https://github.com/mmi404/modelmate', NULL, 2, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'erenty', 'E-Renty', 'ADD',
    'A bilingual (English/Hungarian) marketing and self-service website for a Budapest e-bike/scooter rental and courier company — fleet catalog, vehicle detail pages, a multi-step rental flow, courier subscriptions, and business/repair-partner offerings.',
    'Next.js 16 (App Router, Turbopack) + React 19, CSS Modules with a custom design-token system, custom EN/HU i18n middleware, ~15 components across 78 commits. No backend yet — forms simulate success states. Deployed live via PM2 + nginx + Let''s Encrypt.',
    NULL,
    'https://erenty.tamimul.dev', NULL, NULL, 3, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'joursey', 'Joursey', 'ADD',
    'A dark-themed e-commerce site built for CUET students to order national-team football jerseys, with manual bKash/Nagad payment verification, plus a bundled penalty-shootout mini-game and a World Cup match predictor with its own leaderboard.',
    'Vanilla HTML/CSS/JS (no framework) + Firebase Auth (restricted to @student.cuet.ac.bd emails), Firestore for products/orders/predictions/analytics, Firebase Hosting, GA4. Atomic stock control, admin dashboard with CSV export.',
    NULL,
    NULL, NULL, NULL, 4, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'travel-agency', 'Whistle While You Wander', 'ADD',
    'A marketing/lead-generation website for a travel agency brand, themed "Cinematic Dark" (navy and gold), with Disney, family-trip, and road-trip pages and a contact form that captures leads.',
    'Next.js 16 + TypeScript + Tailwind 4 frontend; Spring Boot 3.2 (Java 17) + JPA + MySQL backend that persists contact-form leads only (no auth/business logic). Built in roughly 5 hours as a rapid AI-assisted build — a good example of fast end-to-end delivery.',
    NULL,
    NULL, 'https://github.com/mmi404/travel_agency', NULL, 5, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'novem', 'Novem', 'ADD',
    'A corporate B2B marketing website for "Novem," an industrial freeze-drying and food-manufacturing company serving the pet-food and agri-food industries — covers capabilities, logistics, pharma, and quality.',
    'Next.js 16 (App Router, TS) + React 19 + Tailwind + Framer Motion. Nearly the full sitemap is built (home/about/agri-food/pet-food/capabilities/logistics/pharma/quality/why-novem/contact).',
    NULL,
    NULL, 'https://github.com/mmi404/food', NULL, 6, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'medfiles-ai', 'MedFiles.ai', 'ADD',
    'A landing page (not the full app) for "MedFiles.ai," a digital medical-history app positioned around security, accessibility, and user control.',
    'Next.js 16 + React 19 + Framer Motion + Tailwind v4. Sections: Hero, TrustStrip, ProblemSolution, WhyMedFiles, Features, Pricing, SocialProof. Built through a multi-AI-tool workflow (Gemini "Antigravity" for planning/screenshot-audit, Claude Code for implementation) — worth mentioning as a working-method highlight.',
    NULL,
    NULL, 'https://github.com/mmi404/medfiles.ai', NULL, 7, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'fitcircle', 'FitCircle', 'ADD',
    'A mobile-first fitness/social app concept — "Start alone. Grow together." A private streak-building habit tracker that can opt into community challenges, leaderboards, and AI/expert-guided plans.',
    'Next.js 16 + React 19 + Tailwind v4 + Framer Motion, plain JS/JSX (no TypeScript). Screens: splash, onboarding, auth, dashboard (Private/Community toggle), challenges, guided plans, profile. No backend — static/placeholder data.',
    NULL,
    NULL, 'https://github.com/mmi404/fitcircle', NULL, 8, TRUE
FROM persona p WHERE p.slug = 'developer';

-- ============================================================================
-- PARTIAL tier — 4 confidentiality-restricted projects
-- Generic, non-identifying public titles/slugs; client_name always NULL;
-- live_url/github_url always NULL; zero project_image rows.
-- ============================================================================
INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'educational-quiz-platform-bangladesh', 'Educational Quiz Platform (Bangladesh)', 'PARTIAL',
    'A live, operating educational quiz app for Bangladeshi children (grades 1-5), with parent/child profiles, real-time 1v1 quiz battles, and subscription payments.',
    'Flutter mobile app (Android/iOS/web/desktop), Spring Boot 3.5 + MySQL backend, Next.js admin dashboard, a Node/Socket.io real-time game server, integration with a PCI-DSS-regulated Bangladeshi payment gateway, Docker + Caddy + GitHub Actions CI/CD.',
    'Built and helped operate a full multi-platform commercial product end-to-end — mobile app, admin panel, real-time multiplayer backend, and a regulated payment integration, for a real paying user base.',
    NULL, NULL, NULL, 9, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'document-archive-system', 'Document Archive System', 'PARTIAL',
    'A document-archive platform for a nonprofit, used to archive records of a real historical event.',
    'Built on the open-source Uwazi (Node.js/React) platform + MongoDB + PostgreSQL + Elasticsearch + Redis + MinIO (five coordinated data stores), Docker/GHCR CI/CD, Nginx, Cloudflare CDN, Sentry.',
    'Operated a complex multi-database production system, wrote deployment/backup/rollback automation, and handled a real production incident (diagnosed and wrote a postmortem for a 7-day outage caused by manual-copy deploys).',
    NULL, NULL, NULL, 10, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'clinical-workflow-mobile-app', 'Clinical Workflow Mobile App', 'PARTIAL',
    'An e-prescription / clinical-workflow mobile app for doctors, built with a small team for a healthcare SaaS product.',
    'Flutter/Dart targeting Android/iOS/Windows, flutter_bloc + GetX state management, dio networking, drug-interaction checking, lab-report analyzer, PDF/QR tooling.',
    'Contributed to a real multi-developer healthcare product as part of a small team (org repo + personal fork, sprint-based feature branches) — a clear "worked on a team" credential.',
    NULL, NULL, NULL, 11, TRUE
FROM persona p WHERE p.slug = 'developer';

INSERT INTO project (persona_id, slug, title, visibility_tier, nontechnical_description, technical_description, experience_description, live_url, github_url, client_name, sort_order, is_published)
SELECT p.id, 'theatrical-promo-website', 'Theatrical Promo Website', 'PARTIAL',
    'A cinematic promo website for a theatrical musical production, with GSAP scroll-driven storytelling.',
    'Next.js 16, GSAP (ScrollTrigger) scrollytelling, custom brand typography, a structured ~1-month freelance engagement (24 commits, multiple redesign passes).',
    'Delivered a polished, animation-heavy marketing site end-to-end for a real paying client with an established brand identity (brand guide, bilingual briefs, logos) — a good example of client-facing freelance work.',
    NULL, NULL, NULL, 12, TRUE
FROM persona p WHERE p.slug = 'developer';

-- ============================================================================
-- project_image rows — ADD tier only, matching each project's "Demo image
-- targets" from the plan. Real screenshots haven't been captured yet, so
-- these use placeholder paths; replace image_url with the real asset path
-- once captured, caption text already describes the intended shot.
-- ============================================================================
INSERT INTO project_image (project_id, image_url, caption, sort_order)
SELECT pr.id, img.image_url, img.caption, img.sort_order
FROM project pr
JOIN (
    SELECT 'reformcuet' AS slug, '/images/projects/reformcuet/1.jpg' AS image_url, 'Homepage / problem feed with voting' AS caption, 1 AS sort_order
    UNION ALL SELECT 'reformcuet', '/images/projects/reformcuet/2.jpg', 'Google OAuth login screen', 2
    UNION ALL SELECT 'reformcuet', '/images/projects/reformcuet/3.jpg', 'DSW resolution workflow', 3
    UNION ALL SELECT 'reformcuet', '/images/projects/reformcuet/4.jpg', 'Polling feature', 4

    UNION ALL SELECT 'modelmate', '/images/projects/modelmate/1.jpg', 'Model browse/search page', 1
    UNION ALL SELECT 'modelmate', '/images/projects/modelmate/2.jpg', 'Review submission form', 2
    UNION ALL SELECT 'modelmate', '/images/projects/modelmate/3.jpg', 'Head-to-head compare view', 3
    UNION ALL SELECT 'modelmate', '/images/projects/modelmate/4.jpg', 'Leaderboard', 4

    UNION ALL SELECT 'erenty', '/images/projects/erenty/1.jpg', 'Fleet catalog', 1
    UNION ALL SELECT 'erenty', '/images/projects/erenty/2.jpg', 'Vehicle detail page', 2
    UNION ALL SELECT 'erenty', '/images/projects/erenty/3.jpg', 'Rental-flow steps', 3
    UNION ALL SELECT 'erenty', '/images/projects/erenty/4.jpg', 'Courier subscription page', 4

    UNION ALL SELECT 'joursey', '/images/projects/joursey/1.jpg', 'Storefront', 1
    UNION ALL SELECT 'joursey', '/images/projects/joursey/2.jpg', 'Order flow', 2
    UNION ALL SELECT 'joursey', '/images/projects/joursey/3.jpg', 'Mini-game', 3
    UNION ALL SELECT 'joursey', '/images/projects/joursey/4.jpg', 'Predictor leaderboard', 4

    UNION ALL SELECT 'travel-agency', '/images/projects/travel-agency/1.jpg', 'Homepage', 1
    UNION ALL SELECT 'travel-agency', '/images/projects/travel-agency/2.jpg', 'Disney / family / road-trip pages', 2
    UNION ALL SELECT 'travel-agency', '/images/projects/travel-agency/3.jpg', 'Contact form', 3

    UNION ALL SELECT 'novem', '/images/projects/novem/1.jpg', 'Homepage', 1
    UNION ALL SELECT 'novem', '/images/projects/novem/2.jpg', 'Agri-food / pet-food pages', 2
    UNION ALL SELECT 'novem', '/images/projects/novem/3.jpg', 'Capabilities page', 3

    UNION ALL SELECT 'medfiles-ai', '/images/projects/medfiles-ai/1.jpg', 'Hero section', 1
    UNION ALL SELECT 'medfiles-ai', '/images/projects/medfiles-ai/2.jpg', 'Features / pricing sections', 2

    UNION ALL SELECT 'fitcircle', '/images/projects/fitcircle/1.jpg', 'Dashboard with Private/Community toggle', 1
    UNION ALL SELECT 'fitcircle', '/images/projects/fitcircle/2.jpg', 'Onboarding flow', 2
    UNION ALL SELECT 'fitcircle', '/images/projects/fitcircle/3.jpg', 'Challenges screen', 3
) img ON img.slug = pr.slug;

-- ============================================================================
-- project_tech_tag rows
-- ============================================================================
INSERT INTO project_tech_tag (project_id, tech_tag_id)
SELECT pr.id, tt.id
FROM project pr
JOIN (
    SELECT 'reformcuet' AS slug, 'java' AS tag UNION ALL SELECT 'reformcuet', 'spring-boot'
    UNION ALL SELECT 'reformcuet', 'spring-security' UNION ALL SELECT 'reformcuet', 'postgresql'
    UNION ALL SELECT 'reformcuet', 'redis' UNION ALL SELECT 'reformcuet', 'flyway'
    UNION ALL SELECT 'reformcuet', 'bucket4j' UNION ALL SELECT 'reformcuet', 'nextjs'
    UNION ALL SELECT 'reformcuet', 'react' UNION ALL SELECT 'reformcuet', 'typescript'
    UNION ALL SELECT 'reformcuet', 'tailwind-css' UNION ALL SELECT 'reformcuet', 'tanstack-query'
    UNION ALL SELECT 'reformcuet', 'docker' UNION ALL SELECT 'reformcuet', 'github-actions'
    UNION ALL SELECT 'reformcuet', 'prometheus' UNION ALL SELECT 'reformcuet', 'sentry'
    UNION ALL SELECT 'reformcuet', 'aws-s3'

    UNION ALL SELECT 'modelmate', 'nextjs' UNION ALL SELECT 'modelmate', 'typescript'
    UNION ALL SELECT 'modelmate', 'tailwind-css' UNION ALL SELECT 'modelmate', 'tanstack-query'
    UNION ALL SELECT 'modelmate', 'java' UNION ALL SELECT 'modelmate', 'spring-boot'
    UNION ALL SELECT 'modelmate', 'spring-security' UNION ALL SELECT 'modelmate', 'postgresql'
    UNION ALL SELECT 'modelmate', 'flyway' UNION ALL SELECT 'modelmate', 'bucket4j'
    UNION ALL SELECT 'modelmate', 'docker' UNION ALL SELECT 'modelmate', 'github-actions'

    UNION ALL SELECT 'erenty', 'nextjs' UNION ALL SELECT 'erenty', 'react'
    UNION ALL SELECT 'erenty', 'css-modules'

    UNION ALL SELECT 'joursey', 'vanilla-javascript' UNION ALL SELECT 'joursey', 'firebase'
    UNION ALL SELECT 'joursey', 'firestore'

    UNION ALL SELECT 'travel-agency', 'nextjs' UNION ALL SELECT 'travel-agency', 'typescript'
    UNION ALL SELECT 'travel-agency', 'tailwind-css' UNION ALL SELECT 'travel-agency', 'java'
    UNION ALL SELECT 'travel-agency', 'spring-boot' UNION ALL SELECT 'travel-agency', 'mysql'

    UNION ALL SELECT 'novem', 'nextjs' UNION ALL SELECT 'novem', 'typescript'
    UNION ALL SELECT 'novem', 'tailwind-css' UNION ALL SELECT 'novem', 'react'
    UNION ALL SELECT 'novem', 'framer-motion'

    UNION ALL SELECT 'medfiles-ai', 'nextjs' UNION ALL SELECT 'medfiles-ai', 'react'
    UNION ALL SELECT 'medfiles-ai', 'framer-motion' UNION ALL SELECT 'medfiles-ai', 'tailwind-css'

    UNION ALL SELECT 'fitcircle', 'nextjs' UNION ALL SELECT 'fitcircle', 'react'
    UNION ALL SELECT 'fitcircle', 'tailwind-css' UNION ALL SELECT 'fitcircle', 'framer-motion'
    UNION ALL SELECT 'fitcircle', 'javascript'

    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'flutter'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'dart'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'spring-boot'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'mysql'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'nextjs'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'nodejs'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'socketio'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'docker'
    UNION ALL SELECT 'educational-quiz-platform-bangladesh', 'github-actions'

    UNION ALL SELECT 'document-archive-system', 'uwazi'
    UNION ALL SELECT 'document-archive-system', 'nodejs'
    UNION ALL SELECT 'document-archive-system', 'react'
    UNION ALL SELECT 'document-archive-system', 'mongodb'
    UNION ALL SELECT 'document-archive-system', 'postgresql'
    UNION ALL SELECT 'document-archive-system', 'elasticsearch'
    UNION ALL SELECT 'document-archive-system', 'redis'
    UNION ALL SELECT 'document-archive-system', 'minio'
    UNION ALL SELECT 'document-archive-system', 'docker'
    UNION ALL SELECT 'document-archive-system', 'nginx'
    UNION ALL SELECT 'document-archive-system', 'sentry'

    UNION ALL SELECT 'clinical-workflow-mobile-app', 'flutter'
    UNION ALL SELECT 'clinical-workflow-mobile-app', 'dart'

    UNION ALL SELECT 'theatrical-promo-website', 'nextjs'
    UNION ALL SELECT 'theatrical-promo-website', 'gsap'
) map ON map.slug = pr.slug
JOIN tech_tag tt ON tt.slug = map.tag;
