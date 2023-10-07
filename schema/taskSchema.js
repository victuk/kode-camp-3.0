const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const taskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: true
    },
    taskBody: {
        type: String,
        required: true
    },
    pictureName: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {timestamps: true});

taskSchema.plugin(mongoosePaginate);

const taskCollection = mongoose.model("tasks", taskSchema);

module.exports = {
    taskCollection
};
