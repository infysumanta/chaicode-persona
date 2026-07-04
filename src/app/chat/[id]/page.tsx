import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getChat } from "@/lib/chats";
import { getPersona } from "@/lib/personas";
import { AppHeader } from "@/components/app-header";
import { ChatView } from "@/components/chat/chat-view";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const chat = await getChat(id, session.user.id);
  if (!chat) notFound();

  const persona = getPersona(chat.persona);
  if (!persona) notFound();

  return (
    <>
      <AppHeader />
      <ChatView
        chatId={chat.id}
        persona={persona}
        title={chat.title}
        initialMessages={chat.messages}
      />
    </>
  );
}
