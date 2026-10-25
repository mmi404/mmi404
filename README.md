<div align="center">
  <img src="docs/assets/profile.png" width="140" alt="Profile photo" />

  ### Hi, I'm mmi404 👋
  Developer · Photographer · Researcher-in-progress — building a portfolio that grows with all of it.

  **[mmi404.com](https://mmi404.com)**
</div>

---

## This repo

Source for my personal portfolio site: a Spring Boot + MySQL API, a separate Next.js frontend, containerized with Docker and deployed via GitHub Actions.

![CI](https://github.com/mmi404/mmi404/actions/workflows/ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

Architecture, schema, and the full build plan live in [`docs/architecture.md`](docs/architecture.md).

### Local dev

```bash
# 1. start MySQL
docker compose -f docker/docker-compose.dev.yml up -d

# 2. backend (http://localhost:8080)
cd backend && ./mvnw spring-boot:run

# 3. frontend (http://localhost:3000)
cd frontend && npm install && npm run dev
```
