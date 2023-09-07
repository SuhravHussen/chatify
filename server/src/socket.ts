import { Server } from "socket.io";
import http from "http";
import UserService from "./services/user";

export default function setupSocket(server: http.Server): void {
  const io = new Server(server, {
    cors: { origin: process.env.ALLOWED_ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("userDisconnected", ({ user }: { user: string }) => {
      console.log("User logged out:", user);

      UserService.updateLastLogin(user).then(() => {
        UserService.updateActiveStatus(user, false).then((res) => {
          socket.broadcast.emit("userUpdated", { user: res });
        });
      });
    });

    socket.on("userConnected", ({ user }: { user: string }) => {
      console.log("User connected:", user);
      // Perform any necessary actions when a user logs in
      UserService.updateActiveStatus(user, true).then((res) => {
        socket.broadcast.emit("userUpdated", { user: res });
      });
    });

    socket.on("typingStarted", ({ to, from }) => {
      console.log(`${from} is typing: ${to}`);
      // Emit the typing status to the other user(s)
      socket.broadcast.emit("typingStarted", { to, from });
    });

    socket.on("typingStopped", ({ to, from }) => {
      console.log(`${from} is stopped typing to: ${to}`);
      // Emit the typing status to the other user(s)
      socket.broadcast.emit("typingStopped", { to, from });
    });

    socket.on("sendMessage", ({ message, from, to }) => {
      // Emit the message to the other user(s)
      socket.broadcast.emit("receiveMessage", { message, from, to });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Perform cleanup or necessary actions on socket disconnect
    });
  });
}
