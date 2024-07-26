"use client";

import socket, { connectSocket } from "@/app/socket";
import { MessageForm } from "@/components/messageForm";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { User, Message } from "@/types";


const page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    connectSocket();

    socket.on("connectedUsers", (users) => {
      setUsers(users);
    });

    socket.on("newUserConnected", (user) => {
      // @ts-ignore
      setUsers((prev) => [...prev, user]);
    })

    socket.on("userDisconnected", (userId) => {
      // @ts-ignore
      setUsers((prev) => prev.filter(user => user._id !== userId));
    })

    socket.on("message", (msg) => {
      // need to add to useState only if the message is for the selected user
      if (msg.user === selectedUser) {
        setMessages((prev) => [...prev, msg]);
      }
    })

    console.log(messages);

    return () => {
      socket.off("connectedUsers");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newUserConnected");
      socket.off("userDisconnected");
      socket.off("message");
    }
    
  }, [selectedUser]);

  const user = users.find((user) => user._id === selectedUser);

  return (
    <section className="flex h-screen">
      <Sidebar users={users} selectUser={setSelectedUser} />
      <div className="w-full flex flex-col h-full p-4">
        <div className="border-b-white border-b w-full p-6">
          <h4>{user?.username}</h4>
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
            gdsa gdsa gdsagdsagdsca gdsahguiklghdsa gdsjakhlgdsa gdsajkghdsakjg
            gdsaagdsa gdsagdsagdsagsdgdsagdsagsdgsda gdsagdsa
          </div>
          {messages.map((msg) => {
            let position = msg.user === selectedUser ? "self-start" : "self-end";
            return (<div className={`${position} bg-blue-600 w-fit max-w-80 p-1 rounded-lg`}>
              {msg.message}
            </div>)
          })}
        </div>

        <MessageForm user={selectedUser} addMessage={setMessages} />
      </div>
    </section>
  );
};

export default page;


// if (user?._id === msg.user) {
//   // @ts-ignore
//   setMessages((prev) => [...prev, msg.message]);
// }
// setMessages((prev) => [...prev, msg.message]);