const express = require("express");
const port = process.env.PORT || 4000;
const monogoose = require("mongoose");
require("dotenv").config();
const tasksRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const taskWithPicture = require("./routes/uploadPics");
const cors = require("cors");
const logger = require("morgan");
const shopItemsRoute = require("./routes/shopItems");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
// 3x

io.use((socket, next) => {
  const token = socket.request.headers.auth;

  const {error, user} = ioAuthController(token);

  if(error) return socket.emit("error", "an error occurred while trying to authenticate");

  socket.request.userDetails = user;

  next();

});

io.on("connection", async (socket) => {

  const socketId = socket.id;
  const userDetails = socket.request.userDetails;

  const user = await connectedUsersCollection.create({
    user: userDetails.userId,
    socketId
  });

  const onlineUser = await userCollection.findById(userDetails.userId);

  socket.broadcast.emit("user-online", `${onlineUser.fullName} is online`);

  socket.on("users", async ({}, callback) => {
    const users = await userCollection.find({_id: {$ne: userDetails.userId}});
    callback(users);
  });

  socket.on("chats", async ({}, callback) => {
    const chats = await chatsCollection.find({$or: [{user1: userDetails.userId}, {user2: userDetails.userId}]});
    callback(chats);
  });

  socket.on("add-to-chat", async (id, callback) => {

    if(await userCollection.findOne({user1: userDetails.userId, user2: id})) {
      callback({
        successful: false,
        message: "Already exists"
      });
      return;
    }

    await chatsCollection.create({
      user1: userDetails.userId,
      user2: id
    });

    callback({
      successful: true,
      message: "Added Successfully!"
    });
  });

  socket.on("send-message", async (payload, callback) => {
    
    await messagesCollection.create({
      sender: userDetails.userId,
      chatId: payload.chatId,
      receiver: payload.userId,
      message: payload.message
    });

    const user = await connectedUsersCollection.find({user: payload.userId}, "socketId");

    const userScocketIds = user.map(socketId => {
      return socketId.socketId;
    });

    socket.to(userScocketIds).emit("new-message", {
      message: payload.message
    });

    callback({
      successful: true,
      message: "Your message has been sent"
    });
  });

  socket.on("messages", async (payload, callback) => {
    const chatMessages = await messagesCollection.find({chatId: payload.chatId});
    callback(chatMessages);
  });

  socket.on("disconnect", async (reason) => {
    await connectedUsersCollection.findOneAndDelete({
      socketId
    });
  });
});

cloudinary.config({ 
  cloud_name: process.env.cloudinaryName, 
  api_key: process.env.cloudinaryApiKey, 
  api_secret: process.env.cloudinarySecret,
  secure: true
});

const multer = require("multer");
const upload = multer({dest: "public/"});
const { taskCollection } = require("./schema/taskSchema");
const { isUserLoggedIn, ioAuthController } = require("./routes/middlewares");
const { connectedUsersCollection } = require("./schema/connectedUsers");
const { userCollection } = require("./schema/userSchema");
const { chatsCollection } = require("./schema/chats");
const { messagesCollection } = require("./schema/messages");

const connect = monogoose.connect(process.env.mongoDBURL);

connect.then(() => {
  console.log("Connected sucessfully to my database");
}).catch((error) => {
  console.log("Could not connect to the database, reason =", error);
});


app.use(cors({
  origin: "*"
})); // methods, allowedHeaders
app.use(logger("tiny")); // dev, short, tiny, common, combined
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/tasks", tasksRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/upload-pic", taskWithPicture);
app.use("/v1/shop-items-route", shopItemsRoute);

app.use(isUserLoggedIn);

app.post("/pic", upload.single("taskPicture"), async (req, res) => {

  try {
      const {taskTitle, taskBody} = req.body;
  const {filename} = req.file;
  const {userId} = req.decoded;

  console.log(req.file);

  const cloudinaryUpload = await cloudinary.uploader.upload("public/" + filename, {
    folder: "task-picture"
  });

  console.log(cloudinaryUpload.secure_url);

  const newTask = await taskCollection.create({
      taskTitle, taskBody, pictureName: cloudinaryUpload.secure_url, user: userId
  });

  res.send({
      successful: true,
      newTask
  });

  } catch (error) {
      res.status(500).json({message: "Internal server error"});
  }
});

httpServer.listen(port, function() {
  console.log("REST and socket.io listening on port", port);
});

// module.exports = app;
