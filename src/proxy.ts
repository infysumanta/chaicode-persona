import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ponytail: cookie-presence check only (no DB hit at the edge). Server components
// re-validate the real session; this just gates unauthenticated visitors.
export function proxy(request: NextRequest) {
  const session = getSessionCookie(request);
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/chat/:path*"] };
