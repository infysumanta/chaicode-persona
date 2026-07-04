import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import {
  streamText,
  generateText,
  convertToModelMessages,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { appRouter } from "./routers/_app";
import { createContext } from "./trpc";
import { auth } from "@/lib/auth";
import { getPersona } from "@/lib/personas";
import { saveMessages } from "@/lib/chats";

// Single API app: Better Auth, tRPC, and AI chat streaming all mounted here and
// served through one Next catch-all route (src/app/api/[[...route]]/route.ts).
export const app = new Hono();

// --- Better Auth: every /api/auth/* endpoint ---
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// --- tRPC: chat CRUD ---
app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (_opts, c) => createContext({ headers: c.req.raw.headers }),
  })
);

// --- AI chat streaming ---
function textOf(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
}

async function makeTitle(seed: string, model: string): Promise<string> {
  const fallback = seed.replace(/\s+/g, " ").slice(0, 60) || "New chat";
  try {
    const { text } = await generateText({
      model: openai(model),
      prompt: `Write a short 3-6 word title (no quotes, no trailing punctuation) for a chat that starts with:\n"${seed.slice(0, 300)}"`,
    });
    return text.replace(/["\n]/g, "").trim().slice(0, 80) || fallback;
  } catch {
    return fallback;
  }
}

app.post("/api/chat", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return c.text("Unauthorized", 401);

  const { messages, chatId, persona: personaId } = (await c.req.json()) as {
    messages: UIMessage[];
    chatId: string;
    persona: string;
  };

  const persona = getPersona(personaId);
  if (!persona) return c.text("Unknown persona", 400);
  if (!chatId) return c.text("Missing chatId", 400);

  const userId = session.user.id;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const result = streamText({
    model: openai(model),
    system: persona.systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: finalMessages }) => {
      const userMsgs = finalMessages.filter((m) => m.role === "user");
      const title = userMsgs.length === 1 ? await makeTitle(textOf(userMsgs[0]), model) : undefined;
      await saveMessages(chatId, userId, finalMessages, title);
    },
  });
});

export type ApiApp = typeof app;
