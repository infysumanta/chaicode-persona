import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { listChats, getChat, createChat, renameChat, deleteChat } from "@/lib/chats";

const title = z.string().trim().min(1).max(80);
const persona = z.enum(["hitesh", "piyush"]);

export const chatRouter = router({
  list: protectedProcedure.query(({ ctx }) => listChats(ctx.user.id)),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => getChat(input.id, ctx.user.id)),

  create: protectedProcedure
    .input(z.object({ persona, title }))
    .mutation(({ ctx, input }) => createChat(ctx.user.id, input.persona, input.title)),

  rename: protectedProcedure
    .input(z.object({ id: z.string(), title }))
    .mutation(({ ctx, input }) => renameChat(input.id, ctx.user.id, input.title)),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => deleteChat(input.id, ctx.user.id)),
});
