const fs = require("fs");

function executThis() {

  try {

    fs.unlinkSync("task.txt");
    console.log("Task file has been deleted Successfully!");
    
  } catch (error) {
    console.log("Here is the error", error);
  }

}

executThis();
