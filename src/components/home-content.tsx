"use client";
import Link from "next/link";
import Image from "next/image";
import { Plus, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PERSONA_LIST, getPersona } from "@/lib/personas";
import { NewChatDialog } from "@/components/new-chat-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeContent() {
  const { data: chats, isLoading } = trpc.chat.list.useQuery();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Seekho apne favourite mentors se ☕
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Chat with AI personas of Hitesh Choudhary and Piyush Garg. Pick one and ask anything —
          web dev, backend, DevOps, GenAI, career.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {PERSONA_LIST.map((p) => (
          <NewChatDialog key={p.id} defaultPersona={p.id}>
            <button
              className={`persona-${p.id} group flex flex-col items-start gap-4 rounded-2xl border bg-card/60 p-6 text-left backdrop-blur transition hover:accent-ring hover:bg-card`}
            >
              <div className="flex w-full items-center gap-4">
                <Image src={p.avatar} alt={p.name} width={56} height={56} className="rounded-full accent-ring" />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold">{p.name}</div>
                  <div className="truncate text-sm accent-text">{p.handle}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium accent-text">
                <Plus className="size-4" /> Start a chat
              </span>
            </button>
          </NewChatDialog>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent chats
        </h2>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {chats.map((c) => {
              const persona = getPersona(c.persona);
              return (
                <Link
                  key={c.id}
                  href={`/chat/${c.id}`}
                  className={`persona-${c.persona} flex items-center gap-3 rounded-xl border bg-card/50 p-4 transition hover:accent-ring hover:bg-card`}
                >
                  {persona && (
                    <Image src={persona.avatar} alt={persona.name} width={36} height={36} className="rounded-full" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{persona?.name}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="size-4" /> No chats yet — start one above.
          </p>
        )}
      </section>
    </div>
  );
}
