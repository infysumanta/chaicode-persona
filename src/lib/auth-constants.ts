// Dependency-free so the edge proxy can import it without pulling in the
// MongoDB driver. Keep in sync with the Better Auth config in src/lib/auth.ts.
export const COOKIE_PREFIX = "chaicode";
export const SESSION_COOKIE_NAME = "auth_token";
