"use client";

/**
 * Client-side helper for calling /api/admin/[...path] (the same-origin
 * proxy to the backend's admin API) from form/mutation components.
 *
 * Error messages: the backend's GlobalExceptionHandler only gives a real,
 * human-readable `detail` string for 409s (DataIntegrityViolationException
 * -> a ProblemDetail body). Everything else — 400 validation failures
 * (including the PARTIAL-tier confidentiality rule), 401, 403, 404 — falls
 * through to Spring Boot's default error body, which is `{timestamp,
 * status, error, path}` with NO message field (confirmed directly: POST
 * /api/admin/projects with a PARTIAL tier + liveUrl set returns exactly
 * `{"timestamp":...,"status":400,"error":"Bad Request","path":...}`, no
 * explanation of which rule was violated). So for 400 specifically, this
 * can only ever show a generic hint — the actual UI prevention has to live
 * in the form itself (see project-form.tsx disabling/clearing
 * liveUrl/githubUrl/clientName when PARTIAL is selected).
 */

export interface AdminRequestResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  errorMessage: string | null;
}

export async function adminRequest<T>(
  path: string,
  options?: { method?: string; body?: unknown; formData?: FormData }
): Promise<AdminRequestResult<T>> {
  const method = options?.method ?? "GET";
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;

  if (options?.formData) {
    body = options.formData;
  } else if (options?.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  let res: Response;
  try {
    res = await fetch(`/api/admin${path}`, { method, headers, body });
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      errorMessage: "Network error — check your connection and try again.",
    };
  }

  let parsed: unknown = null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      parsed = await res.json();
    } catch {
      // empty or non-JSON body (e.g. 204 No Content) — fine, leave null
    }
  }

  if (res.ok) {
    return { ok: true, status: res.status, data: (parsed as T) ?? null, errorMessage: null };
  }

  return {
    ok: false,
    status: res.status,
    data: null,
    errorMessage: describeAdminError(res.status, parsed),
  };
}

function describeAdminError(status: number, parsed: unknown): string {
  if (
    parsed &&
    typeof parsed === "object" &&
    "detail" in parsed &&
    typeof (parsed as { detail?: unknown }).detail === "string"
  ) {
    return (parsed as { detail: string }).detail;
  }

  switch (status) {
    case 400:
      return "The server rejected this. Double-check the fields — for example, a PARTIAL-tier project can't have a live URL, GitHub URL, or client name.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "Not found — it may have already been deleted.";
    case 409:
      return "That conflicts with an existing record (e.g. a duplicate slug).";
    case 503:
      return "The admin service is temporarily unavailable.";
    default:
      return `Request failed (status ${status}).`;
  }
}
