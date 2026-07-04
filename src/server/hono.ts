import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import {
  streamText,
  generateText,
  convertToModelMessages,
  tool,
  stepCountIs,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { appRouter } from "./routers/_app";
import { createContext } from "./trpc";
import { auth } from "@/lib/auth";
import { getPersona } from "@/lib/personas";
import { saveMessages } from "@/lib/chats";
import { findCourses, COURSE_GUIDANCE } from "@/lib/courses";
import { SEARCH_GUIDANCE, guardrails } from "@/lib/personas";
import { youtubeId } from "@/lib/youtube";

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

// --- YouTube oEmbed (title/author for link previews; no API key, no CORS issue) ---
app.get("/api/oembed", async (c) => {
  const url = c.req.query("url");
  if (!url || !youtubeId(url)) return c.json({ error: "invalid url" }, 400);
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!r.ok) return c.json({ error: "not found" }, 502);
    const j = (await r.json()) as {
      title?: string;
      author_name?: string;
      author_url?: string;
      thumbnail_url?: string;
    };
    return c.json({
      title: j.title,
      author: j.author_name,
      authorUrl: j.author_url,
      thumbnail: j.thumbnail_url,
    });
  } catch {
    return c.json({ error: "fetch failed" }, 502);
  }
});

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
  const userName = session.user.name?.split(" ")[0]?.trim();
  const userNote = userName
    ? `\n\nThe person you are chatting with is named ${userName}. Address them by their first name naturally and warmly when it fits (e.g. in a greeting), but don't overuse it in every message.`
    : "";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  // History may contain tool parts (incl. provider-executed web_search) that don't
  // round-trip through convertToModelMessages. The model only needs the text, so
  // keep just text parts for conversion. The UI still persists/renders full parts.
  const historyForModel = messages
    .map((m) => ({ ...m, parts: m.parts.filter((part) => part.type === "text") }))
    .filter((m) => m.parts.length > 0);

  const result = streamText({
    // Responses API so we can use OpenAI's built-in web search tool.
    model: openai.responses(model),
    system: persona.systemPrompt + COURSE_GUIDANCE + SEARCH_GUIDANCE + guardrails(persona.name) + userNote,
    messages: await convertToModelMessages(historyForModel),
    stopWhen: stepCountIs(5),
    tools: {
      // Provider-executed web search (uses OPENAI_API_KEY). Lets the mentor find
      // and share DIRECT links to their own YouTube videos, blogs, and docs.
      web_search: openai.tools.webSearch(),
      recommendCourses: tool({
        description:
          "Look up THIS mentor's own real, current courses relevant to a topic the user wants to learn. Call it only when the user is trying to learn a topic the mentor teaches, so you can share a genuine enroll link as a friendly optional suggestion. Returns [] when nothing fits -- then do not mention any course, and do not recommend anyone else's course.",
        inputSchema: z.object({
          topic: z
            .string()
            .describe("the tech/topic the user wants to learn, e.g. 'docker', 'react', 'system design'"),
        }),
        execute: async ({ topic }) => findCourses(persona.id, topic),
      }),
      searchYouTubeChannel: tool({
        description:
          "Search the mentor's OWN YouTube channel for videos on a topic, and return a link that opens those results on their channel. Use when the user would benefit from watching the mentor's videos on a topic.",
        inputSchema: z.object({
          topic: z.string().describe("the topic to search on the mentor's channel"),
        }),
        execute: async ({ topic }) => ({
          channel: persona.youtube.name,
          channelUrl: persona.youtube.url,
          searchUrl: `${persona.youtube.url}/search?query=${encodeURIComponent(topic)}`,
          topic,
        }),
      }),
    },
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
