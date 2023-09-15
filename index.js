const express = require("express");
const port = process.env.PORT || 4000;
const app = express();
const monogoose = require("mongoose");
require("dotenv").config();
const {taskCollection} = require("./schema/taskSchema");

const connect = monogoose.connect(process.env.mongoDBURL);

connect.then(() => {
  console.log("Connected sucessfully to my database");
}).catch((error) => {
  console.log("Could not connect to the database, reason =", error);
});


app.use(express.json());


app.get("/", async (req, res) => {
  const tasks = await taskCollection.find();
  res.json(tasks);
});

app.post("/", async(req, res) => {
  const newTask = await taskCollection.create({
    taskTitle: req.body.taskTitle,
    taskBody: req.body.taskBody
  });
  res.json({
    isRequestSuccesful: true,
    newTask
  });
});

app.get("/by-id/:id", async (req, res) => {
  const task = await taskCollection.findById(req.params.id);
  res.send(task);
});

app.get("/by-task-title/:title", async (req, res) => {
  const task = await taskCollection.findOne({taskTitle: req.params.title});

  if(!task) {
    return res.status(404).send("not-found");
  }

  res.send(task);
});

app.patch("/:id", async (req, res) => {
  const updatedTask = await taskCollection.findByIdAndUpdate(req.params.id, {
    taskBody: req.body.taskBody
  }, {new: true});

  res.json({
    message: "Task updated Sucessfully",
    updatedTask
  });

});

app.delete("/:id", async (req, res) => {
  await taskCollection.findByIdAndDelete(req.params.id);
  res.send("Task has been deleted sucessfully!");
});

app.listen(port, function() {
  console.log("Listening on port", port);
});
