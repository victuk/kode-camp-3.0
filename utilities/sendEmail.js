const sendMail = require("nodemailer");

const options = {
    service: "gmail",
    auth: {
        user: "ukokjnr@gmail.com",
        pass: "bayardbelqjfngts"
    }
}; 


const send = sendMail.createTransport(options);

module.exports = {send};