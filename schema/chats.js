const mongoose = require("mongoose");

const chatsScchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {timestamps: true});

const chatsCollection = mongoose.model("chats", chatsScchema);

module.exports = {
    chatsCollection
}