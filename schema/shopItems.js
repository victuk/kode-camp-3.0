const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const shopItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    isInStock: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

shopItemSchema.plugin(mongoosePaginate);

const shopItemsCollection = mongoose.model("shopItems", shopItemSchema);

module.exports = {
    shopItemsCollection
};
