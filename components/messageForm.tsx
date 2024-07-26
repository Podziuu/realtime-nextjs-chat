"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import socket, { connectSocket } from "@/app/socket";
import { useEffect } from "react";
// import { toast } from "@/components/ui/use-toast"
import { IMessage } from "@/types";

const FormSchema = z.object({
    message: z.string().min(1)
});

export function MessageForm({user, addMessage}: {user: string, addMessage: any}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    socket.emit("message", {message: data.message, user});
    // addMessage({message: data.message, user: "me"}); // make this our id
    addMessage((prev: IMessage[]) => [...prev, {message: data.message, user: "me"}]);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-auto space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your text here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </Form>
  );
}
