import { handle } from "hono/vercel";
import { app } from "@/server/hono";

// Streaming AI responses can run longer than the default.
export const maxDuration = 300; // 5 minutes

export const GET = handle(app);
export const POST = handle(app);
