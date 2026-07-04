"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({ title: z.string().trim().min(1, "Title required").max(80) });
type FormValues = z.infer<typeof schema>;

export function RenameDialog({
  chatId,
  currentTitle,
  open,
  onOpenChange,
}: {
  chatId: string;
  currentTitle: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const utils = trpc.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: currentTitle },
  });

  useEffect(() => {
    if (open) form.reset({ title: currentTitle });
  }, [open, currentTitle, form]);

  const rename = trpc.chat.rename.useMutation({
    onSuccess: () => {
      utils.chat.list.invalidate();
      utils.chat.getById.invalidate({ id: chatId });
      toast.success("Renamed");
      onOpenChange(false);
    },
    onError: () => toast.error("Rename failed"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => rename.mutate({ id: chatId, title: v.title }))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={rename.isPending}>
                {rename.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
