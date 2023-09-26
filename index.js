const express = require("express");
const port = process.env.PORT || 4000;
const app = express();
const monogoose = require("mongoose");
require("dotenv").config();
const tasksRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");
const path = require("path");
// const taskWithPicture = require("./routes/uploadPics");


const multer = require("multer");
const upload = multer({dest: "public/"});
const { taskCollection } = require("./schema/taskSchema");
const { isUserLoggedIn } = require("./routes/middlewares");

const connect = monogoose.connect(process.env.mongoDBURL);

connect.then(() => {
  console.log("Connected sucessfully to my database");
}).catch((error) => {
  console.log("Could not connect to the database, reason =", error);
});


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/tasks", tasksRoute);
app.use("/v1/auth", authRoute);
// app.use("/v1/upload-pic", taskWithPicture)

app.use(isUserLoggedIn);

app.post("/pic", upload.single("file"), async (req, res) => {

  try {
      const {taskTitle, taskBody} = req.body;
  const {filename} = req.file;
  const {userId} = req.decoded;

  console.log(req.file);
  

  const newTask = await taskCollection.create({
      taskTitle, taskBody, pictureName: filename, user: userId
  });

  res.send({
      successful: true,
      newTask
  });

  } catch (error) {
      res.status(500).json({message: "Internal server error"});
  }
});

app.listen(port, function() {
  console.log("Listening on port", port);
});
