import { ObjectId } from "mongodb";
import type { UIMessage } from "ai";
import { db } from "./mongodb";
import type { PersonaId } from "./personas";

export interface ChatDoc {
  _id: ObjectId;
  userId: string;
  persona: PersonaId;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatDTO {
  id: string;
  persona: PersonaId;
  title: string;
  messages: UIMessage[];
  createdAt: string;
  updatedAt: string;
}

const chats = () => db.collection<ChatDoc>("chats");

function toDTO(doc: ChatDoc): ChatDTO {
  return {
    id: doc._id.toString(),
    persona: doc.persona,
    title: doc.title,
    messages: doc.messages ?? [],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listChats(userId: string): Promise<ChatDTO[]> {
  const docs = await chats()
    .find({ userId }, { projection: { messages: 0 } })
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map((d) => toDTO({ ...d, messages: [] }));
}

export async function getChat(id: string, userId: string): Promise<ChatDTO | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await chats().findOne({ _id: new ObjectId(id), userId });
  return doc ? toDTO(doc) : null;
}

export async function createChat(userId: string, persona: PersonaId, title: string): Promise<ChatDTO> {
  const now = new Date();
  const doc: ChatDoc = {
    _id: new ObjectId(),
    userId,
    persona,
    title,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  await chats().insertOne(doc);
  return toDTO(doc);
}

export async function renameChat(id: string, userId: string, title: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const res = await chats().updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { title, updatedAt: new Date() } }
  );
  return res.matchedCount > 0;
}

export async function deleteChat(id: string, userId: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const res = await chats().deleteOne({ _id: new ObjectId(id), userId });
  return res.deletedCount > 0;
}

// Called by the streaming route to persist a full exchange.
export async function saveMessages(
  id: string,
  userId: string,
  messages: UIMessage[],
  title?: string
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const set: Partial<ChatDoc> = { messages, updatedAt: new Date() };
  if (title) set.title = title;
  await chats().updateOne({ _id: new ObjectId(id), userId }, { $set: set });
}
