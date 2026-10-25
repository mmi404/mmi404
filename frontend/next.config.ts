import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // M7: Docker multi-stage build copies only `.next/standalone` + `.next/static`
  // + `public` into the runtime image (see frontend/Dockerfile), not
  // node_modules. Confirmed via node_modules/next/dist/docs/01-app/02-guides/
  // self-hosting.md ("Cache Components works by default with Next.js ...
  // This includes deployment ... when used with a Docker container") that
  // `output: 'standalone'` has no special interaction with cacheComponents —
  // it only changes what `next build` copies for deployment, not how
  // rendering/caching behaves.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Every backend data fetch in this app is deliberately uncached and
    // Suspense-wrapped (see src/lib/api.ts). During `next build`, Next.js
    // starts those fetches to build the static shell, then aborts them once
    // the shell is complete — which otherwise logs a noisy, expected
    // "HANGING_PROMISE_REJECTION" for every route. This silences that.
    hideLogsAfterAbort: true,
    // This dev machine runs very close to its RAM limit (backend + MySQL +
    // browser + editor all competing for ~10GB total), and `next build`'s
    // default worker count (CPU-core-based) was triggering real
    // out-of-memory crashes ("Zone Allocation failed") partway through type
    // checking. Sizing the worker pool to available memory instead of CPU
    // count fixes that and is a sane default on any constrained host, not
    // just this one.
    memoryBasedWorkersCount: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
