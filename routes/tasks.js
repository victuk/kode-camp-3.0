const express = require("express");
const route = express.Router();
const { taskCollection } = require("../schema/taskSchema");
const jwt = require("jsonwebtoken");
const router = require("./auth");
const { adminsOnly, isUserLoggedIn } = require("./middlewares");
require("dotenv").config();

route.use(isUserLoggedIn);

route.get("/", async (req, res) => {
  const tasks = await taskCollection.find({ user: req.decoded.userId });
  res.json(tasks);
});

route.post("/", async (req, res) => {

  try {
    const {taskTitle, taskBody} = req.body;
    const {userId} = req.decoded;
    const newTask = await taskCollection.create({
      taskTitle,
      taskBody,
      user: userId
    });

    res.json({
      isRequestSuccesful: true,
      newTask
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal-server-error");
  }
});

route.get("/by-id/:id", async (req, res) => {
  try {
    const task = await taskCollection.findById(req.params.id);
    res.send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal-server-error");
  }
});

route.get("/by-task-title/:title", async (req, res) => {
  try {
    const task = await taskCollection.findOne({ taskTitle: req.params.title });

    if (!task) {
      return res.status(404).send("not-found");
    }

    res.send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal-server-error");
  }
});

route.patch("/:id", async (req, res) => {
  const {id} = req.params;
  const updatedTask = await taskCollection.findByIdAndUpdate(id, {
    taskBody: req.body.taskBody
  }, { new: true });

  res.json({
    message: "Task updated Sucessfully",
    updatedTask
  });
});

route.delete("/:id", async (req, res) => {

  const {id} = req.params;

  const note = await taskCollection.findById(id);

  if(req.decoded.userId != note.user) {
    res.status(401).send("You are not allowed to delete this task");
    return;
  }

  await taskCollection.findByIdAndDelete(req.params.id);
  res.send("Task has been deleted sucessfully!");
});

route.get("/admin/all-tasks", adminsOnly, async (req, res) => {
  const tasks = await taskCollection.find();
  res.send(tasks);
});

module.exports = route;
