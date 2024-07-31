"use client";

import React, { useEffect, useState } from "react";
import { MessageForm } from "./messageForm";
import { SocketMessage, MessagePanelProps } from "@/types";
import socket, { connectSocket } from "@/app/socket";
import { useSearchParams } from 'next/navigation'
import {IMessage} from "../database/message.model";

const MessagePanel = ({messageArray, username}: MessagePanelProps) => {
  const [messages, setMessages] = useState<SocketMessage[]>([]);

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
        {messageArray && JSON.parse(messageArray).map((msg: IMessage) => {
          let position = msg.from.toString() === selectedUser ? "self-start" : "self-end";
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
        {messages.map((msg, index) => {
          let position = msg.user === selectedUser ? "self-start" : "self-end";
          return (
            <div
              className={`${position} bg-blue-600 w-fit max-w-80 p-1 rounded-lg`}
              key={index}
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
