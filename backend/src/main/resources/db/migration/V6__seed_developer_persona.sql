INSERT INTO persona (slug, display_name, tagline, icon_key, nav_order, is_published)
VALUES ('developer', 'Developer', 'Full-stack web & mobile engineer', 'code', 1, TRUE);

INSERT INTO persona_profile (persona_id, headline, intro_markdown)
SELECT
    p.id,
    'Full-stack engineer building production web & mobile products',
    'I build full-stack web and mobile products end to end — from database schema and backend APIs to polished, responsive frontends and the Docker/CI pipelines that ship them. My stack centers on Java/Spring Boot and Next.js/TypeScript, with hands-on production experience across PostgreSQL, MySQL, Redis, Flutter, and real-time systems. Below is a selection of projects I have built or contributed to, ranging from fully open production platforms to client and team work I can only describe at a high level.'
FROM persona p
WHERE p.slug = 'developer';
