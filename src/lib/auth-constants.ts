// Dependency-free so the edge proxy can import it without pulling in the
// MongoDB driver. Keep in sync with the Better Auth config in src/lib/auth.ts.
//
// With only a cookiePrefix set, Better Auth names cookies `<prefix>.<key>`,
// e.g. `chaicode.session_token`. Do NOT set a custom per-cookie `name` here:
// getSessionCookie() always looks up `<prefix>.session_token`, so a bare custom
// name would never match and the proxy would loop back to /login.
export const COOKIE_PREFIX = "chaicode";
