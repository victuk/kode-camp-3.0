const express = require("express");
const route = express.Router();
const {taskCollection} = require("../schema/taskSchema");

route.get("/", async (req, res) => {
    const tasks = await taskCollection.find();
    res.json(tasks);
  });
  
  route.post("/", async(req, res) => {
    const newTask = await taskCollection.create({
      taskTitle: req.body.taskTitle,
      taskBody: req.body.taskBody
    });
    res.json({
      isRequestSuccesful: true,
      newTask
    });
  });
  
  route.get("/by-id/:id", async (req, res) => {
    const task = await taskCollection.findById(req.params.id);
    res.send(task);
  });
  
  route.get("/by-task-title/:title", async (req, res) => {
    const task = await taskCollection.findOne({taskTitle: req.params.title});
  
    if(!task) {
      return res.status(404).send("not-found");
    }
  
    res.send(task);
  });
  
  route.patch("/:id", async (req, res) => {
    const updatedTask = await taskCollection.findByIdAndUpdate(req.params.id, {
      taskBody: req.body.taskBody
    }, {new: true});
  
    res.json({
      message: "Task updated Sucessfully",
      updatedTask
    });
  
  });
  
  route.delete("/:id", async (req, res) => {
    await taskCollection.findByIdAndDelete(req.params.id);
    res.send("Task has been deleted sucessfully!");
  });

module.exports = route;
