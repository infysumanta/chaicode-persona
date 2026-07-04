"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ChatHistorySheet } from "@/components/chat-history-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { NewChatDialog } from "@/components/new-chat-dialog";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/70 px-3 shadow-sm backdrop-blur sm:px-4">
      <ChatHistorySheet />
      <Link href="/" className="mr-auto flex items-center gap-2 font-bold">
        <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-md" />
        <span className="hidden sm:inline">Chai aur Code</span>
      </Link>
      <NewChatDialog>
        <Button size="sm" className="gap-1">
          <Plus className="size-4" />
          <span className="hidden sm:inline">New chat</span>
        </Button>
      </NewChatDialog>
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
