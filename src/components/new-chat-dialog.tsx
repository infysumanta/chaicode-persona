"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { PERSONA_LIST, type PersonaId } from "@/lib/personas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({ persona: z.enum(["hitesh", "piyush"]) });
type FormValues = z.infer<typeof schema>;

export function NewChatDialog({
  defaultPersona = "hitesh",
  children,
}: {
  defaultPersona?: PersonaId;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.chat.create.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { persona: defaultPersona },
  });

  const selected = form.watch("persona");

  const onSubmit = async (values: FormValues) => {
    try {
      // Title is a placeholder; it's generated dynamically from the first message.
      const chat = await create.mutateAsync({ persona: values.persona, title: "New chat" });
      await utils.chat.list.invalidate();
      setOpen(false);
      router.push(`/chat/${chat.id}`);
    } catch {
      toast.error("Could not start chat. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) form.reset({ persona: defaultPersona });
      }}
    >
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className={`persona-${selected}`}>
        <DialogHeader>
          <DialogTitle>Start a new chat</DialogTitle>
          <DialogDescription>Pick a mentor and start chatting.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentor</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      {PERSONA_LIST.map((p) => {
                        const active = field.value === p.id;
                        return (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => field.onChange(p.id)}
                            className={`persona-${p.id} flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                              active ? "accent-ring bg-accent/40" : "hover:bg-accent/30"
                            }`}
                          >
                            <Image
                              src={p.avatar}
                              alt={p.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold">{p.name}</span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {p.handle}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full accent-grad text-white"
              disabled={form.formState.isSubmitting || create.isPending}
            >
              {create.isPending ? "Starting…" : "Start chat"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
