const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await userCollection.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword
    });

    res.status(201).send("Created Successfully");

});

router.post("/login", async (req, res) => {

    const userDetail = await userCollection.findOne({email: req.body.email});

    if(!userDetail) return res.status(404).send("user-not-found");

    const doesPasswordMatch = bcrypt.compareSync(req.body.password, userDetail.password);

    if(!doesPasswordMatch) return res.status(400).send("invalid-credential");

    const token = jwt.sign({
        email: userDetail.email,
        userId: userDetail._id
    }, process.env.secret);

    res.send({
        message: "Sign in Successful",
        token
    });

});

module.exports = router;
