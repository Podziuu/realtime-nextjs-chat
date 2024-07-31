"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createChat } from "@/actions/user.action";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(2).max(20),
});

const NewChat = ({ currentUser }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const { toast } = useToast();
  const path = usePathname();
  console.log(path);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      setIsLoading(true);
      const res = await createChat({
        username: values.username,
        userId: currentUser,
        path,
      });

      console.log(res);
    } catch (error) {
      // @ts-ignore
      console.log(error.message, "WIADOMOSC BLEDU");
      toast({
        // @ts-ignore
        title: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    // console.log(res);
  };

  return (
    <Dialog>
      {!isLoading ? (
        <DialogTrigger asChild>
          <Button variant="ghost">
            <IconPlus className="mr-2" /> Add new chat
          </Button>
        </DialogTrigger>
      ) : (
        <div className="text-center">Loading...</div>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new chat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter an username you want to chat with"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChat;
