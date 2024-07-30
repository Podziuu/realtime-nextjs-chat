//@ts-nocheck

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./utils/mongoose.ts";
import User from "./database/user.model.ts";
import Message from "./database/message.model.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const connectedUsers = new Set();

const getConnectedUsers = async () => {
  const usersArr = Array.from(connectedUsers);
  console.log(usersArr);
  const usersIds = usersArr.map((user) => user.userId);
  console.log(usersIds);
  const users = await User.find({ _id: { $in: usersIds } }).select(
    "_id username"
  );
  return users;
};

const getUserSocketId = (userId) => {
  const user = Array.from(connectedUsers).find((user) => user.userId === userId);
  return user.socketId;
}

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
    // connectedUsers.add(socket.userId);
    connectedUsers.add({ userId: socket.userId, socketId: socket.id});

    const allUsers = await getConnectedUsers();
    // New connected user gets all other connected users
    const usersForNewUser = allUsers.filter(user => user._id.toString() !== socket.userId)
    socket.emit("connectedUsers", usersForNewUser);
    // All other connected users get the updated list of connected users
    const newUser = await User.findById(socket.userId).select("_id username");
    socket.broadcast.emit("newUserConnected", newUser);

    socket.on("disconnect", async () => {
      console.log("user disconnected");
      // connectedUsers.delete({ userId: socket.userId, socketId: socket.id });
      connectedUsers.forEach((user) => {
        if (user.userId === socket.userId) {
          connectedUsers.delete(user);
      }})
    
      // All other connected users get the id of user who disconnected
      socket.broadcast.emit("userDisconnected", socket.userId);
    });

    socket.on("message", async (msg) => {
      // console.log("message: " + msg.message + " from " + socket.userId + "to " + msg.user);
      console.log(`message ${msg.message} from ${socket.userId} to ${msg.user}`);
      // emit message to the specific user
      const userSocketId = getUserSocketId(msg.user);
      socket.to(userSocketId).emit("message", { message: msg.message, user: socket.userId });
      // add this message to database
      const mess = await Message.create({ from: socket.userId, to: msg.user, message: msg.message });
      await User.findByIdAndUpdate(socket.userId, { $push: { sentMessages: mess._id}, $addToSet: { chats: msg.user } });
      await User.findByIdAndUpdate(msg.user, { $push: { receivedMessages: mess._id}, $addToSet: { chats: socket.userId } });
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
