import { API_BASE_URL } from "@/lib/config";

/**
 * Thin server-side proxy to POST /api/contact-messages on the backend.
 *
 * Why proxy instead of calling the backend directly from the browser: the
 * backend has no CORS configuration for the frontend's origin (and we
 * can't modify the backend here), so a direct browser -> backend POST
 * would be blocked by the browser's CORS policy in anything but same-origin
 * dev setups. Routing through this same-origin Route Handler avoids that
 * entirely, and also keeps the backend's base URL out of client bundles.
 *
 * As of M5, POST /api/contact-messages may not exist yet (M4.5 is being
 * built in parallel) — a 404 here is expected and surfaced to the form as
 * a "not connected yet" message rather than a crash.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { messageBody, replyEmail, replyPhone } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof messageBody !== "string" || messageBody.trim().length === 0) {
    return Response.json({ message: "Message is required." }, { status: 400 });
  }

  const payload: Record<string, string> = { messageBody };
  if (typeof replyEmail === "string" && replyEmail.trim()) {
    payload.replyEmail = replyEmail.trim();
  }
  if (typeof replyPhone === "string" && replyPhone.trim()) {
    payload.replyPhone = replyPhone.trim();
  }

  // Forward the real visitor's IP/User-Agent through this proxy hop.
  // Without this, the backend sees the Next.js server's own fetch-client
  // identity for every submission (ip_address would be identical for every
  // visitor once deployed behind Caddy, and Bucket4j rate limiting — keyed
  // by that IP — would lock out every visitor after 5 total submissions
  // from anyone). The backend already resolves the real chain from
  // X-Forwarded-For (server.forward-headers-strategy=framework per
  // docs/architecture.md), so this just needs to propagate the header
  // through the Next.js -> backend hop the way Caddy will propagate it
  // through the Caddy -> Next.js hop in production. In local dev with no
  // proxy in front of Next.js, x-forwarded-for is simply absent — that's
  // left as-is rather than fabricated.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const visitorUserAgent = request.headers.get("user-agent");

  try {
    const backendRes = await fetch(`${API_BASE_URL}/api/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
        ...(visitorUserAgent ? { "User-Agent": visitorUserAgent } : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await backendRes.text();
    return new Response(text || null, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (err) {
    console.error("[api/contact] backend unreachable", err);
    return Response.json(
      { message: "The contact service is temporarily unavailable." },
      { status: 503 }
    );
  }
}
