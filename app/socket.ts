"use client";

import { io } from "socket.io-client";

const socket = io({
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (token: string) => {
//   socket.auth = { token };
  socket.connect();

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  })

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  })
};

export const disconnectSocket = () => {
    if(socket.connected) {
        socket.disconnect();
    }
}

export default socket;
