import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Public routes reachable without a session. /login doubles as registration
// (OAuth-only: GitHub/Google).
const PUBLIC_PATHS = ["/login"];

// ponytail: cookie-presence check only (no DB hit at the edge). Server components
// re-validate the real session; this just handles redirect UX.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = !!getSessionCookie(request);
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Not signed in and hitting a protected route -> login.
  if (!hasSession && !isPublic) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in but on the login page -> home.
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Run on every route except API, Next internals, and public assets.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|personas).*)"],
};
