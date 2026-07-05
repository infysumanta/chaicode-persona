import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongodb";
import { COOKIE_PREFIX } from "./auth-constants";

// Production URL (hardcoded so OAuth/redirects work on the deployed site even if
// env isn't set). Deployed on Vercel from `main`.
const PROD_URL = "https://chaicode-persona.vercel.app";

// Cookies are namespaced under COOKIE_PREFIX, e.g. `chaicode.session_token`.
export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || PROD_URL,
  trustedOrigins: [PROD_URL, "http://localhost:3000"],
  advanced: {
    cookiePrefix: COOKIE_PREFIX,
  },
  // Same verified email across GitHub/Google = one account, not two.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
