"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import socket, { connectSocket } from "@/app/socket";
import { ChatWithRecentMessage, IUser, SidebarProps, ConnectedUser } from "@/types";
import queryString from "query-string";
import { useRouter } from "next/navigation";
import NewChat from "./newChat";

const Sidebar = ({ chats, currentUser }: SidebarProps) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const router = useRouter();

  const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
    setSelectedUser(e.currentTarget.id);
    const parsed = queryString.parse(location.search);
    parsed.user = e.currentTarget.id;
    const url = queryString.stringifyUrl({
      url: location.pathname,
      query: parsed,
    });
    router.push(url, { scroll: false });
  };

  useEffect(() => {
    connectSocket();

    socket.on("connectedUsers", (users) => {
      setUsers(users);
    });

    socket.on("newUserConnected", (user) => {
      // @ts-ignore
      setUsers((prev) => [...prev, user]);
    });

    socket.on("userDisconnected", (userId) => {
      // @ts-ignore
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    });

    return () => {
      socket.off("connectedUsers");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newUserConnected");
      socket.off("userDisconnected");
    };
  }, []);

  return (
    <div className="w-1/3 md:w-1/4 relative">
      <Tabs defaultValue="your_chats" className="w-full flex flex-col h-full">
        <TabsList className="w-full flex-none spaxe-x-2 lg:space-x-16">
          <TabsTrigger className="max-md:text-xs"  value="your_chats">Your chats</TabsTrigger>
          <TabsTrigger className="max-md:text-xs" value="active_users">Active users</TabsTrigger>
        </TabsList>
        <TabsContent value="your_chats" className="flex-1 overflow-auto">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="mt-8 max-md:text-xl text-4xl font-bold">
                Your chats
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between flex-col flex-1">
              <div className="space-y-6">
                {chats &&
                  JSON.parse(chats).map((chat: ChatWithRecentMessage) => (
                    <div key={chat.chatUser._id} id={chat.chatUser._id} onClick={clickHandler} className="cursor-pointer">
                      <p className="font-bold text-lg">{chat.chatUser.username}</p>
                      <p className="text-md text-white">
                        {chat.recentMessage && (currentUser === chat.recentMessage.from.toString()
                          ? "You: "
                          : `${chat.chatUser.username}: `)}
                        <span className="text-slate-600 font-normal">{chat.recentMessage && chat.recentMessage.message}</span>
                      </p>
                    </div>
                  ))}
              </div>
              <NewChat currentUser={currentUser} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active_users" className="flex-1 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="mt-8 max-md:text-xl text-4xl font-bold">
                Active users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.map((user: ConnectedUser) => (
                <div
                  className="cursor-pointer"
                  onClick={clickHandler}
                  key={user._id}
                  id={user._id}
                >
                  {user.username}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
