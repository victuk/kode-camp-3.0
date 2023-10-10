const sendMail = require("nodemailer");
require("dotenv").config();

const options = {
    service: "gmail",
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailPassword
    }
};


const send = sendMail.createTransport(options);

module.exports = {send};