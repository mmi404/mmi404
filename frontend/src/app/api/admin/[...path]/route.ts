import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin-auth";

/**
 * Catch-all same-origin proxy for every /api/admin/** backend call that
 * originates in the browser (login, logout, and every create/update/delete/
 * upload mutation from an admin form). Read-only page loads fetch the
 * backend directly from Server Components instead (see src/lib/admin-api.ts)
 * — this proxy exists only because browser-initiated requests need it:
 *
 * 1. No CORS config on the backend (same situation as the public contact
 *    form in M5) — a direct browser -> backend call would be blocked.
 * 2. The backend's JWT lives in an httpOnly `ACCESS_TOKEN` cookie scoped to
 *    whichever origin set it. Routing every admin call through this
 *    same-origin route means the browser only ever holds a cookie for
 *    *this* app's origin, and this proxy reads it server-side and forwards
 *    it as the `Cookie` header on the backend call.
 *
 * Critically, POST /api/admin/auth/login's response sets that cookie via
 * Set-Cookie. A naive proxy that reconstructs a Response from the backend's
 * body without copying Set-Cookie would silently drop it, leaving the
 * browser never logged in even though the backend returned 200. This uses
 * `getSetCookie()` (returns each Set-Cookie header as its own array entry,
 * unlike `.get("set-cookie")` which would mangle multiple cookies into one
 * comma-joined string) and re-attaches every one to the outgoing response.
 */
async function proxyAdmin(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const backendUrl = new URL(`/api/admin/${path.join("/")}`, API_BASE_URL);
  backendUrl.search = request.nextUrl.search;

  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const headers = new Headers();
  const incomingContentType = request.headers.get("content-type");
  if (incomingContentType) headers.set("content-type", incomingContentType);
  if (token) headers.set("cookie", `${ADMIN_TOKEN_COOKIE}=${token}`);

  const canHaveBody = !["GET", "HEAD"].includes(request.method);
  const bodyBuffer = canHaveBody ? await request.arrayBuffer() : undefined;

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: bodyBuffer && bodyBuffer.byteLength > 0 ? bodyBuffer : undefined,
    });
  } catch (err) {
    console.error("[api/admin proxy] backend unreachable", err);
    return Response.json(
      { message: "The admin service is temporarily unavailable." },
      { status: 503 }
    );
  }

  const responseHeaders = new Headers();
  const contentType = backendRes.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  for (const cookie of backendRes.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }

  // 204/205/304 are "null body" statuses per the Fetch spec — the Response
  // constructor throws ("Invalid response status code 204") if given a body
  // at all, even an empty one, so those must pass `null` explicitly rather
  // than an empty ArrayBuffer. Confirmed by hitting this directly: DELETE
  // /api/admin/projects/{id} (backend returns 204) 500'd here before this
  // fix.
  const isNullBodyStatus = [204, 205, 304].includes(backendRes.status);
  const bodyOut = isNullBodyStatus ? null : await backendRes.arrayBuffer();
  return new Response(bodyOut, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export {
  proxyAdmin as GET,
  proxyAdmin as POST,
  proxyAdmin as PUT,
  proxyAdmin as PATCH,
  proxyAdmin as DELETE,
};
