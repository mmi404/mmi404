/**
 * Server-only configuration. This module must never be imported from a
 * "use client" file — it is only read inside Server Components, Route
 * Handlers, and other server-side code during data fetching.
 */
export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8080";

export const SITE_NAME = "mmi404";

export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";
