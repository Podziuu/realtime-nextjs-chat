"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import socket, { connectSocket } from "@/app/socket";
import { IUser } from "@/types";
import { useUserStore } from "@/store/userState";
import queryString from 'query-string';
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const router = useRouter();

  const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
    setSelectedUser(e.currentTarget.id);
    // @ts-ignore
    useUserStore.setState({username: e.currentTarget.textContent});
    useUserStore.setState({selectedUser: e.currentTarget.id});
    const parsed = queryString.parse(location.search);
    parsed.user = e.currentTarget.id;
    const url = queryString.stringifyUrl({url: location.pathname, query: parsed});
    router.push(url, {scroll: false});
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
    }
  }, [])

  return (
    <div className="w-1/4 relative">
      <Tabs defaultValue="your_chats" className="w-full flex flex-col h-full">
        <TabsList className="w-full flex-none space-x-16">
          <TabsTrigger value="your_chats">Your chats</TabsTrigger>
          <TabsTrigger value="active_users">Active users</TabsTrigger>
        </TabsList>
        <TabsContent value="your_chats" className="flex-1 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="mt-8 text-4xl font-bold">
                Your chats
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active_users" className="flex-1 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="mt-8 text-4xl font-bold">
                Active users
              </CardTitle>
            </CardHeader>
            <CardContent>
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
              {users.map((user: any) => (
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
