import { Tabs } from "@/components/ui/tabs";
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
    <section>
      <div className="w-1/4 h-screen relative ">
        <Tabs tabs={tabs} />
      </div>
      <div></div>
    </section>
  );
};

export default page;
