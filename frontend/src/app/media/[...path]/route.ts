import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/config";

/**
 * Same-origin proxy for backend-served media (`/uploads/**` and
 * `/images/**`). `resolveMediaUrl` in src/lib/api.ts points every image src
 * at this route instead of baking `API_BASE_URL` straight into the HTML/JS
 * sent to a browser. That distinction matters here in a way it doesn't for
 * the JSON API: `API_BASE_URL` is a server-to-server address (the Docker
 * Compose service name in dev, a private network address in prod) that only
 * this Next.js server can resolve — a visitor's browser loading an <img src>
 * directly against it would just fail to connect. Routing media through this
 * same-origin path means the browser only ever needs to reach the frontend's
 * own public origin.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const backendUrl = new URL(`/${path.join("/")}`, API_BASE_URL);

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl);
  } catch (err) {
    console.error("[media proxy] backend unreachable", err);
    return new Response(null, { status: 502 });
  }

  if (!backendRes.ok) {
    return new Response(null, { status: backendRes.status });
  }

  const headers = new Headers();
  const contentType = backendRes.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  // Uploaded files are stored under a random UUID filename and never
  // modified in place (edits/deletes create or remove rows, not overwrite
  // bytes), so a long immutable cache is safe.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(backendRes.body, { status: 200, headers });
}
