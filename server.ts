//@ts-nocheck

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./utils/mongoose.ts";
import User from "./database/user.model.ts";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const connectedUsers = new Set();

const getConnectedUsers = async () => {
  const usersArr = Array.from(connectedUsers);
  const users = await User.find({ _id: { $in: usersArr } }).select(
    "_id username"
  );
  return users;
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  connectToDatabase();

  io.use((socket, next) => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.userId = decoded.userId;
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("New client connected", socket.userId);
    connectedUsers.add(socket.userId);

    const allUsers = await getConnectedUsers();
    // New connected user gets all other connected users
    const usersForNewUser = allUsers.filter(user => user._id.toString() !== socket.userId)
    socket.emit("connectedUsers", usersForNewUser);
    // All other connected users get the updated list of connected users
    const newUser = await User.findById(socket.userId).select("_id username");
    socket.broadcast.emit("newUserConnected", newUser);

    socket.on("disconnect", async () => {
      console.log("user disconnected");
      connectedUsers.delete(socket.userId);
      // All other connected users get the id of user who disconnected
      socket.broadcast.emit("userDisconnected", socket.userId);
    });

    socket.on("message", (msg) => {
      console.log("message: " + msg + " from " + socket.userId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
