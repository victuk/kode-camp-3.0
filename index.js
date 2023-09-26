const express = require("express");
const port = process.env.PORT || 4000;
const app = express();
const monogoose = require("mongoose");
require("dotenv").config();
const tasksRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");

const connect = monogoose.connect(process.env.mongoDBURL);

connect.then(() => {
  console.log("Connected sucessfully to my database");
}).catch((error) => {
  console.log("Could not connect to the database, reason =", error);
});


app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/v1/tasks", tasksRoute);
app.use("/v1/auth", authRoute);

app.listen(port, function() {
  console.log("Listening on port", port);
});
