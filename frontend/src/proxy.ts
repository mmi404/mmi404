import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin-auth";

/**
 * Route gate for /admin/**. Named `proxy.ts`, not `middleware.ts` — Next.js
 * 16 deprecated the `middleware.js` file convention and renamed it to
 * `proxy.js` (same NextRequest/NextResponse API, same `config.matcher`);
 * see node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
 * {middleware,proxy}.md.
 *
 * This only checks whether the ACCESS_TOKEN cookie is present — it is a UX
 * convenience (don't show admin screens to a visibly-logged-out browser and
 * bounce them to the login form), NOT the real security boundary. The JWT's
 * signature/expiry is never validated here. The backend's JwtAuthenticationFilter
 * on /api/admin/** is the actual boundary: a present-but-expired-or-forged
 * cookie still gets a 401 from every backend call, this proxy just avoids
 * showing a broken-looking admin shell before that 401 happens.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasToken = request.cookies.has(ADMIN_TOKEN_COOKIE);
  if (!hasToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
