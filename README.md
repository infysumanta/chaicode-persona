# Chai aur Code — Persona Chat ☕🚀

Chat with AI personas of **Hitesh Choudhary** ("Chai aur Code") and **Piyush Garg**.
Each replies in-character (Hinglish, catchphrases, mentor tone) and knows about their
real courses and projects. Create chats, switch mentors, and your history is saved with
auto-generated titles.

> Educational fan project. Personas are AI imitations, not the real people.

**Live demo:** https://chaicode-persona.vercel.app

**Documentation** ([`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)) — persona data collection & prep, prompt-engineering strategy, context management, and sample conversations for both personas.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **OpenAI** via **AI SDK v7** + **AI Elements**
- **Hono** — one API route serving **tRPC** (chat CRUD) + AI chat streaming + Better Auth
- **tRPC 11** + **Zod** + **TanStack Query**
- **Better Auth** — GitHub + Google OAuth
- **MongoDB** (native driver)
- **React Hook Form** + **Zod** (New Chat / Rename dialogs)
- **shadcn/ui** (Base UI) + **next-themes** — dark by default, per-persona accents, no sidebar, mobile responsive

## Architecture

- `src/server/hono.ts` — the single API app. `/api/auth/*` (Better Auth), `/api/trpc/*` (tRPC), `/api/chat` (streaming). Mounted at `src/app/api/[[...route]]/route.ts`.
- `src/proxy.ts` — gates `/` and `/chat/*` behind a session cookie.
- `src/lib/personas.ts` — persona system prompts + course reference context.
- Chats stored in one MongoDB `chats` collection (messages embedded).

## Local setup

```bash
pnpm install
cp .env.example .env.local   # then fill in real values
pnpm dev
```

### Environment variables

See `.env.example`. You need:

| Var | Where |
| --- | --- |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `http://localhost:3000` locally, your Vercel URL in prod |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth client |
| `OPENAI_MODEL` | optional, default `gpt-4o-mini` |

**OAuth callback URLs** (add these to each provider):
- GitHub: `{BETTER_AUTH_URL}/api/auth/callback/github`
- Google: `{BETTER_AUTH_URL}/api/auth/callback/google`

## Deploy to Vercel

1. Import this repo at https://vercel.com/new.
2. Add all env vars from `.env.example` in **Project → Settings → Environment Variables**.
   Set `BETTER_AUTH_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`).
3. Update the GitHub/Google OAuth callback URLs to use the Vercel URL.
4. Deploy. (No secrets live in this repo — they only exist in Vercel + your local `.env.local`.)
