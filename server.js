const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const formatMessage = require("./utils/message")
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/users")

app.use(express.static("public"))


io.on("connection", socket => {
  socket.on("joinRoom", ({
    username,
    room
  }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    socket.emit("message", formatMessage("ChatCord Bot", "welcome to the chat"))

    socket.broadcast.to(user.room).emit("message", formatMessage("ChatCord bot", `${user.username} has joined the chat`))

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  })

  socket.on("disconnect", () => {
    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit("message", formatMessage("chat bot", `${user.username} has left the chat`))
    }
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log("Server Running"))