"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, MessageSquare, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getPersona } from "@/lib/personas";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";

export function ChatHistorySheet() {
  const [open, setOpen] = useState(false);
  const params = useParams<{ id?: string }>();
  const utils = trpc.useUtils();
  const { data: chats, isLoading } = trpc.chat.list.useQuery(undefined, { enabled: open });
  const del = trpc.chat.delete.useMutation({
    onSuccess: () => {
      utils.chat.list.invalidate();
      toast.success("Chat deleted");
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Chat history" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-80 flex-col p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Your chats</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && (
            <div className="space-y-2 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {chats?.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">
              No chats yet. Start one from the home page.
            </p>
          )}
          {chats?.map((c) => {
            const persona = getPersona(c.persona);
            const active = params.id === c.id;
            return (
              <div
                key={c.id}
                className={`group flex items-center gap-2 rounded-lg px-2 ${
                  active ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <Link
                  href={`/chat/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="flex min-w-0 flex-1 items-center gap-3 py-3"
                >
                  <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {persona?.name}
                    </span>
                  </span>
                </Link>
                <button
                  aria-label="Delete chat"
                  onClick={() => del.mutate({ id: c.id })}
                  className="p-1 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
