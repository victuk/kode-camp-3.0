const express = require("express");
const port = process.env.PORT || 4000;
const app = express();
const monogoose = require("mongoose");
require("dotenv").config();
const tasksRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const taskWithPicture = require("./routes/uploadPics");
          
cloudinary.config({ 
  cloud_name: 'dae4sosbl', 
  api_key: '283128793578546', 
  api_secret: '5n2fLu0S97IIA0u5acfTd56zwIg',
  secure: true
});

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
app.use("/v1/upload-pic", taskWithPicture);

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

app.listen(port, function() {
  console.log("Listening on port", port);
});
