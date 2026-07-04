"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoreVertical, Pencil, ArrowUp, Square } from "lucide-react";
import { type Persona } from "@/lib/personas";
import { trpc } from "@/lib/trpc";
import { RenameDialog } from "@/components/rename-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const titledRef = useRef(initialMessages.length > 0);
  const [renameOpen, setRenameOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId, persona: persona.id },
    }),
    onFinish: () => {
      utils.chat.list.invalidate();
      // Title is generated on the first exchange — pull the fresh one into the header.
      if (!titledRef.current) {
        titledRef.current = true;
        router.refresh();
      }
    },
  });

  const busy = status === "submitted" || status === "streaming";

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className={`persona-${persona.id} flex flex-1 flex-col`}>
      {/* Persona sub-header */}
      <div className="flex items-center gap-3 border-b bg-background/50 px-4 py-2.5 backdrop-blur">
        <Image src={persona.avatar} alt={persona.name} width={36} height={36} className="rounded-full accent-ring" />
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

      {/* Messages */}
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState
              title={`Chat with ${persona.name}`}
              description={persona.greeting}
              icon={
                <Image src={persona.avatar} alt={persona.name} width={56} height={56} className="rounded-full" />
              }
            />
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                {m.role === "assistant" && (
                  <Image
                    src={persona.avatar}
                    alt={persona.name}
                    width={28}
                    height={28}
                    className="mt-1 size-7 rounded-full accent-ring"
                  />
                )}
                <MessageContent>
                  {m.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : null
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer */}
      <div className="mx-auto w-full max-w-3xl px-3 pb-4 sm:px-4">
        <form
          onSubmit={submit}
          className="accent-ring flex items-end gap-2 rounded-2xl border bg-card/70 p-2 backdrop-blur"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={`Message ${persona.name}…`}
            className="max-h-40 min-h-11 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            rows={1}
          />
          {busy ? (
            <Button type="button" size="icon" variant="secondary" onClick={() => stop()} aria-label="Stop">
              <Square className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="accent-grad text-white"
              disabled={!input.trim()}
              aria-label="Send"
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </form>
      </div>

      <RenameDialog chatId={chatId} currentTitle={title} open={renameOpen} onOpenChange={setRenameOpen} />
    </div>
  );
}
