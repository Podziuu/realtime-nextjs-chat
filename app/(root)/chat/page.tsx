import { MessageForm } from "@/components/messageForm";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const tabs = [
  {
    title: "Your chats",
    value: "your chats",
    content: (
      <div className="w-full overflow-hidden relative h-full p-10 text-white bg-gradient-to-br from-neutral-800 to-neutral-950">
        <p className="mt-8 text-4xl font-bold">Your chats</p>
        <div className="flex flex-col gap-6 mt-16">
          <div>
            <p>User 1</p>
            <p>You: Hello</p>
          </div>
          <div>
            <p>User 2</p>
            <p>You: Hello</p>
          </div>
          <div>
            <p>User 3</p>
            <p>You: Hello</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Active users",
    value: "active users",
    content: (
      <div className="w-full overflow-hidden relative h-full p-10 text-white bg-gradient-to-br from-neutral-800 to-neutral-950">
        <p className="mt-8 text-4xl font-bold">Active users</p>
        <div className="flex flex-col gap-6 mt-16">
          <div>
            <p>User 1</p>
          </div>
          <div>
            <p>User 2</p>
          </div>
          <div>
            <p>User 3</p>
          </div>
        </div>
      </div>
    ),
  },
];

const page = () => {
  return (
    <section className="flex h-screen">
      <div className="w-1/4 relative">
        <Tabs tabs={tabs} />
      </div>
      <div className="w-full flex flex-col h-full p-4">
        <div className="border-b-white border-b w-full p-6">
          <h4>User 5</h4>
        </div>
        <div className="p-4 space-y-8 flex flex-col w-full">
          {/* // TODO map through messages */}
          <div className="bg-blue-600 w-fit max-w-80 p-1 rounded-lg">
            Hello i from poland
          </div>
          <div className="self-end bg-blue-600 w-fit max-w-80 p-1 rounded-lg">
            Hello i from england
          </div>
          <div className="bg-blue-600 w-fit max-w-80 p-1 rounded-lg">
            Hello i from poland
          </div>
          <div className="self-end bg-blue-600 w-fit max-w-80 p-1 rounded-lg">
            gdsa gdsa gdsagdsagdsca gdsahguiklghdsa gdsjakhlgdsa gdsajkghdsakjg gdsaagdsa gdsagdsagdsagsdgdsagdsagsdgsda gdsagdsa
          </div>
        </div>

        <MessageForm />
      </div>
    </section>
  );
};

export default page;
