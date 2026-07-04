import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongodb";
import { COOKIE_PREFIX } from "./auth-constants";

// Cookies are namespaced under COOKIE_PREFIX, e.g. `chaicode.session_token`.
export const auth = betterAuth({
  database: mongodbAdapter(db),
  advanced: {
    cookiePrefix: COOKIE_PREFIX,
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
