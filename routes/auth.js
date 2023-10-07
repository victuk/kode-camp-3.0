const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {isL, route} = require("./tasks");
require("dotenv").config();
const {isUserLoggedIn} = require("./middlewares");
const { send } = require("../utilities/sendEmail");
const { v4 } = require("uuid");
const { forgetPasswordCollection } = require("../schema/forgetPasswords");

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


router.post("/forget-password", async(req, res) => {
    try {
        
       const {email} = req.body;
       
       const user = await userCollection.findOne({email});

       if(!user) return res.status(404).send("no-user-found");

       const uid = v4();

        await forgetPasswordCollection.create({
            userId: user._id,
            token: uid
        });

        await send.sendMail({
            to: email,
            subject: "Password Reset",
            html: `
                <div>
                    <h1>Password Reset</h1>
                    <div>Click <a href="">here</a> to reset your password</div>
                    <div>or use this UID = ${uid}</div>
                </div>
            `
        });

        res.send({
            message: "Email sent Successfully!"
        });

    } catch (error) {
        console.log(error);
        res.status(error.status || "500").send(error.message || "Internal server error");
    }
});


router.put("/password-reset", async(req, res) => {
    try {
        const { newPassword, token } = req.body;

        const user = await forgetPasswordCollection.findOne({token});

        if(!user) return res.status(400).send("invalid-token");

        const newHashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

        await userCollection.findByIdAndUpdate(user.userId, {
            password: newHashedPassword
        });

        await forgetPasswordCollection.findOneAndDelete({token});

        res.send({
            message: "Password changed successfully!"
        });

    } catch (error) {
        console.log(error);
        res.status(error.status || "500").send(error.message || "Internal server error");
    }
});

module.exports = router;
