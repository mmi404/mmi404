# Multi-stage build following Next.js's own recommended Docker pattern for
# `output: 'standalone'` (node_modules/next/dist/docs/.../getting-started/
# deploying.md links the canonical example at vercel/next.js/examples/
# with-docker). Confirmed `output: 'standalone'` + Cache Components need no
# special handling together (self-hosting.md: "Cache Components works by
# default ... when used with a Docker container") — standalone only changes
# what `next build` copies for deployment, not rendering/caching behavior.
FROM node:22-alpine AS base

# --- Dependencies --------------------------------------------------------
FROM base AS deps
# Needed for some native npm packages (e.g. sharp-style prebuilds) on musl libc.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build -----------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# .env.local (host-only, localhost API_BASE_URL) is excluded via
# .dockerignore — the running container gets its config entirely from
# docker-compose's `environment:`, not a baked-in dotenv file.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Runtime -----------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# .next/standalone already contains a pruned node_modules with only the
# traced runtime dependencies — no separate `npm install --production` step.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
