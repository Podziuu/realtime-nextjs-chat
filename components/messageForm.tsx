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
import socket from "@/app/socket";
import React from "react";
import { SocketMessage, MessageFormProps } from "@/types";
import { Input } from "./ui/input";

const FormSchema = z.object({
    message: z.string().min(1)
});

export function MessageForm({user, addMessage}: MessageFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    socket.emit("message", {message: data.message, user});
    addMessage((prev: SocketMessage[]) => [...prev, {message: data.message, user: "me"}]);
    form.reset({message: ""});
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
                <Input
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
