import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

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

  io.on("connection", (socket) => {
    // ...
    console.log("New client connected", socket.userId);

    socket.on("disconnect", () => {
      console.log("user disconnected");
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
