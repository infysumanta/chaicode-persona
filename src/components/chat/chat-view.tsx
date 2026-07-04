"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoreVertical, Pencil } from "lucide-react";
import { type Persona, type PersonaId } from "@/lib/personas";
import { trpc } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RenameDialog } from "@/components/rename-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { CourseCards, type CourseCard } from "@/components/chat/course-cards";
import { extractCourseLinks, stripCourseLinks, courseForUrl } from "@/lib/courses";
import { YouTubePreview, ChannelSearchCard } from "@/components/chat/youtube-preview";
import { extractYouTubeLinks, extractYouTubeSearchLinks, stripYouTubeLinks, youtubeId, parseYtSearch } from "@/lib/youtube";
import { extractLinks } from "@/lib/links";
import { MessageSources } from "@/components/chat/message-sources";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

const STARTERS: Record<PersonaId, string[]> = {
  hitesh: [
    "React kaise seekhun?",
    "Backend with Node.js",
    "JavaScript project ideas",
    "DevOps ka roadmap batao",
  ],
  piyush: [
    "How to learn Docker?",
    "System design basics",
    "Node.js backend project idea",
    "GenAI agents kaise banaye?",
  ],
};

// Friendly labels instead of raw tool ids in the Tool header.
const TOOL_TITLES: Record<string, string> = {
  "tool-web_search": "Web search",
  "tool-searchYouTubeChannel": "YouTube channel search",
  "tool-recommendCourses": "Course suggestions",
};

export function ChatView({
  chatId,
  persona,
  title,
  initialMessages,
}: {
  chatId: string;
  persona: Persona;
  title: string;
  initialMessages: UIMessage[];
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userInitials = (user?.name || user?.email || "You").slice(0, 2).toUpperCase();
  const titledRef = useRef(initialMessages.length > 0);
  const [renameOpen, setRenameOpen] = useState(false);

  const { messages, sendMessage, status, stop } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId, persona: persona.id },
    }),
    onFinish: () => {
      utils.chat.list.invalidate();
      if (!titledRef.current) {
        titledRef.current = true;
        router.refresh();
      }
    },
  });

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    sendMessage({ text: t });
  };

  const handleSubmit = (message: PromptInputMessage) => send(message.text);

  return (
    <div className={`persona-${persona.id} flex min-h-0 flex-1 flex-col`}>
      {/* Persona sub-header */}
      <div className="flex shrink-0 items-center gap-3 border-b bg-background/60 px-4 py-2.5 shadow-sm backdrop-blur">
        <Image
          src={persona.avatar}
          alt={persona.name}
          width={36}
          height={36}
          className="size-9 rounded-full object-cover accent-ring"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="truncate text-xs text-muted-foreground">
            with {persona.name} · {persona.handle}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Chat options" />}>
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRenameOpen(true)}>
              <Pencil className="mr-2 size-4" /> Rename
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages (scroll region) */}
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 py-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              title={`Chat with ${persona.name}`}
              description={persona.greeting}
              icon={
                <Image
                  src={persona.avatar}
                  alt={persona.name}
                  width={64}
                  height={64}
                  className="size-16 rounded-full object-cover accent-ring"
                />
              }
            />
          ) : (
            messages.map((m) => {
              const toolCourseUrls = new Set<string>();
              const toolSearchUrls = new Set<string>();
              for (const part of m.parts) {
                if (part.type === "tool-recommendCourses") {
                  const out = (part as { output?: CourseCard[] }).output;
                  if (Array.isArray(out)) out.forEach((c) => c?.url && toolCourseUrls.add(c.url));
                }
                if (part.type === "tool-searchYouTubeChannel") {
                  const out = (part as { output?: { searchUrl?: string } }).output;
                  if (out?.searchUrl) toolSearchUrls.add(out.searchUrl);
                }
              }
              const assistantText =
                m.role === "assistant"
                  ? m.parts
                      .filter((p) => p.type === "text")
                      .map((p) => (p as { text: string }).text)
                      .join("\n")
                  : "";
              return (
              <Message key={m.id} from={m.role} className="animate-message-in">
                {m.role === "user" && (
                  <div className="flex items-center gap-2 self-end">
                    <span className="text-sm font-semibold">
                      {user?.name?.split(" ")[0] ?? "You"}
                    </span>
                    <Avatar className="size-7">
                      {user?.image && <AvatarImage src={user.image} alt="" />}
                      <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2">
                    <Image
                      src={persona.avatar}
                      alt={persona.name}
                      width={28}
                      height={28}
                      className="size-7 shrink-0 rounded-full object-cover accent-ring"
                    />
                    <span className="text-sm font-semibold">{persona.name}</span>
                  </div>
                )}
                <MessageContent>
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse key={i} className="chat-prose">
                          {stripCourseLinks(stripYouTubeLinks(part.text))}
                        </MessageResponse>
                      );
                    }
                    // Course recommendations: render the tool call, with the
                    // clickable course cards nested inside the tool output.
                    if (part.type === "tool-recommendCourses") {
                      const p = part as {
                        type: `tool-${string}`;
                        state: "input-streaming" | "input-available" | "output-available" | "output-error";
                        input?: unknown;
                        output?: CourseCard[];
                        errorText?: string;
                      };
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <Tool>
                            <ToolHeader type={p.type} state={p.state} title="Course suggestions" />
                            <ToolContent>
                              {p.input != null && <ToolInput input={p.input} />}
                              <ToolOutput output={p.output} errorText={p.errorText} />
                            </ToolContent>
                          </Tool>
                          {p.output?.length ? <CourseCards courses={p.output} /> : null}
                        </div>
                      );
                    }
                    // Mentor's YouTube channel search -> channel card.
                    if (part.type === "tool-searchYouTubeChannel") {
                      const p = part as {
                        type: `tool-${string}`;
                        state: "input-streaming" | "input-available" | "output-available" | "output-error";
                        input?: unknown;
                        output?: { channel: string; channelUrl?: string; searchUrl: string; topic?: string };
                        errorText?: string;
                      };
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <Tool>
                            <ToolHeader type={p.type} state={p.state} title="YouTube channel search" />
                            <ToolContent>
                              {p.input != null && <ToolInput input={p.input} />}
                              <ToolOutput output={p.output} errorText={p.errorText} />
                            </ToolContent>
                          </Tool>
                          {p.output ? <ChannelSearchCard {...p.output} /> : null}
                        </div>
                      );
                    }
                    // Any other tool call (e.g. web_search) — generic display.
                    if (typeof part.type === "string" && part.type.startsWith("tool-")) {
                      const p = part as {
                        type: `tool-${string}`;
                        state: "input-streaming" | "input-available" | "output-available" | "output-error";
                        input?: unknown;
                        output?: unknown;
                        errorText?: string;
                      };
                      return (
                        <Tool key={i}>
                          <ToolHeader type={p.type} state={p.state} title={TOOL_TITLES[p.type]} />
                          <ToolContent>
                            {p.input != null && <ToolInput input={p.input} />}
                            <ToolOutput output={p.output} errorText={p.errorText} />
                          </ToolContent>
                        </Tool>
                      );
                    }
                    return null;
                  })}
                  {m.role === "assistant" &&
                    (() => {
                      const links = extractYouTubeLinks(assistantText);
                      return links.length ? (
                        <div className="mt-2 flex flex-col gap-2">
                          {links.map((l) => (
                            <YouTubePreview key={l.id} url={l.url} id={l.id} label={l.label} />
                          ))}
                        </div>
                      ) : null;
                    })()}
                  {m.role === "assistant" &&
                    (() => {
                      const courses = extractCourseLinks(assistantText).filter(
                        (c) => !toolCourseUrls.has(c.url)
                      );
                      return courses.length ? <CourseCards courses={courses} /> : null;
                    })()}
                  {m.role === "assistant" &&
                    (() => {
                      const searches = extractYouTubeSearchLinks(assistantText).filter(
                        (sr) => !toolSearchUrls.has(sr.url)
                      );
                      return searches.length ? (
                        <div className="mt-2 flex flex-col gap-2">
                          {searches.map((sr) => (
                            <ChannelSearchCard
                              key={sr.url}
                              channel={sr.channel ?? "YouTube"}
                              searchUrl={sr.url}
                              topic={sr.query}
                            />
                          ))}
                        </div>
                      ) : null;
                    })()}
                  {m.role === "assistant" &&
                    (() => {
                      const refs = extractLinks(assistantText).filter(
                        (l) => !youtubeId(l.url) && !parseYtSearch(l.url) && !courseForUrl(l.url)
                      );
                      return <MessageSources links={refs} />;
                    })()}
                </MessageContent>
              </Message>
              );
            })
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <div className="flex items-center gap-2">
                <Image
                  src={persona.avatar}
                  alt={persona.name}
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-full object-cover accent-ring"
                />
                <span className="text-sm font-semibold">{persona.name}</span>
              </div>
              <MessageContent>
                <span className="flex items-center gap-1 py-2" aria-label="Thinking">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="size-2 animate-bounce rounded-full bg-muted-foreground/60"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </span>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer */}
      <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-4 sm:px-4">
        {messages.length === 0 && (
          <Suggestions className="mb-2">
            {STARTERS[persona.id].map((s) => (
              <Suggestion key={s} suggestion={s} onClick={send} />
            ))}
          </Suggestions>
        )}
        <PromptInput onSubmit={handleSubmit} className="shadow-soft transition-shadow focus-within:shadow-lg">
          <PromptInputBody>
            <PromptInputTextarea placeholder={`Message ${persona.name}…`} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit status={status} onStop={() => stop()} />
          </PromptInputFooter>
        </PromptInput>
      </div>

      <RenameDialog chatId={chatId} currentTitle={title} open={renameOpen} onOpenChange={setRenameOpen} />
    </div>
  );
}
