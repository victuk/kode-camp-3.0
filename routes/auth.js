const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {isL} = require("./tasks");
require("dotenv").config();
const {isUserLoggedIn} = require("./middlewares");

router.post("/register", async (req, res) => {

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await userCollection.create({
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
        password: hashedPassword
    });

    res.status(201).send("Created Successfully");

});

router.post("/login", async (req, res) => {

    const {email, password} = req.body;

    const userDetail = await userCollection.findOne({email});

    if(!userDetail) return res.status(404).send("user-not-found");

    const doesPasswordMatch = bcrypt.compareSync(password, userDetail.password);

    if(!doesPasswordMatch) return res.status(400).send("invalid-credential");

    const {email:userEmail, _id, role} = userDetail;

    const token = jwt.sign({
        email: userEmail,
        userId: _id,
        role: role
    }, process.env.secret);

    res.send({
        message: "Sign in Successful",
        token
    });
});


router.get("/profile", isUserLoggedIn, async (req, res) => {
    try {
        const {userId} = req.decoded;
        const user = await userCollection.findById(userId, "-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("internal-server-error");
    }
});


module.exports = router;
