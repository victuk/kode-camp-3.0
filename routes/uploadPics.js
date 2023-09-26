const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/"});
const { taskCollection } = require("../schema/taskSchema");
const { isUserLoggedIn } = require("./middlewares");

router.use(isUserLoggedIn);

router.post("/pic", upload.single("file"), async (req, res) => {

    try {
        const {taskTitle, taskBody} = req.body;
    const {originalname} = req.file;
    const {userId} = req.decoded;
    

    const newTask = await taskCollection.create({
        taskTitle, taskBody, pictureName: originalname, user: userId
    });

    res.send({
        successful: true,
        newTask
    });

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;
