"use client";

import React, { useEffect, useState } from "react";

import { MessageForm } from "./messageForm";
import { IMessage } from "@/types";
import socket, { connectSocket } from "@/app/socket";
import { useSearchParams } from 'next/navigation'

const MessagePanel = ({messageArray, username}: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const searchParams = useSearchParams();

  const selectedUser = searchParams.get('user');

  useEffect(() => {
    connectSocket();

    socket.on("message", (msg) => {
      // need to add to useState only if the message is for the selected user
      if (msg.user === selectedUser) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  });

  return (
    <div className="w-full flex flex-col h-full p-4">
      <div className="border-b-white border-b w-full p-6">
        <h4>{username}</h4>
      </div>
      <div className="p-4 space-y-8 flex flex-col w-full overflow-auto no-scrollbar" >
        {/* Messages from database */}
        {messageArray && JSON.parse(messageArray).map((msg: any) => {
          let position = msg.from === selectedUser ? "self-start" : "self-end";
          return (
            <div
              className={`${position} bg-blue-600 w-fit max-w-80 p-1 rounded-lg`}
              key={msg._id}
            >
              {msg.message}
            </div>
          );
        })}
        {/* Messages from socket server */}
        {messages.map((msg) => {
          let position = msg.user === selectedUser ? "self-start" : "self-end";
          return (
            <div
              className={`${position} bg-blue-600 w-fit max-w-80 p-1 rounded-lg`}
              // key={msg.}
            >
              {msg.message}
            </div>
          );
        })}
      </div>

      <MessageForm user={selectedUser} addMessage={setMessages} />
    </div>
  );
};

export default MessagePanel;
