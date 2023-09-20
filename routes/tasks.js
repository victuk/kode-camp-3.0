const express = require("express");
const route = express.Router();
const {taskCollection} = require("../schema/taskSchema");
const jwt = require("jsonwebtoken");
const router = require("./auth");
require("dotenv").config();

function isUserLoggedIn(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if(!authorizationHeader) {
    res.status(401).send("no-authorization-header");
    return;
  }

  const val = authorizationHeader.split(" ");

  const tokenType = val[0];

  const tokenValue = val[1];

  if(tokenType == "Bearer") {
    const decoded = jwt.verify(tokenValue, process.env.secret);
    req.decoded = decoded;
    next();
    return;
  }

  res.status(401).send("not-authorized");

}

route.use(isUserLoggedIn);

route.get("/", async (req, res) => {
    const tasks = await taskCollection.find({user: req.decoded.userId});
    res.json(tasks);
});
  
route.post("/", async(req, res) => {

  try {
    const newTask = await taskCollection.create({
      taskTitle: req.body.taskTitle,
      taskBody: req.body.taskBody,
      user: req.decoded.userId
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
      const task = await taskCollection.findOne({taskTitle: req.params.title});
  
    if(!task) {
      return res.status(404).send("not-found");
    }
  
    res.send(task);
    } catch (error) {
      console.log(error);
      res.status(500).send("internal-server-error");
    }
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
