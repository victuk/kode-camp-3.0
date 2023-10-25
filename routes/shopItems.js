const {shopItemsCollection} = require("../schema/shopItems");
const express = require("express");
const router = express.Router();

router.post("/shop-items", async (req, res) => {
    try {
        await shopItemsCollection.insertMany(req.body.shopItems);

        res.send({
            successful: true,
            message: "Shop Items added successfully!"
        });

    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
});


router.get("/query", async (req, res) => {

    try {
        // $gt = greater than
        // $gte = greater than or equal to
        // $lt = less than
        // $lte = less than or equal to
        // $in = if the value of a property is in the array
        // $nin = if the value of a property is not in the array
        // $and = Accepts an array of objects.
        // All object has to be true for the record to be returned
        // $or = Accepts an array of objects.
        // One of the obects has to be true for a record to be sent back
        // $nor = All objects has to be false for a record to be sent back
        // $not = Could be combined with a comparison operator
        const shopItems = await shopItemsCollection.find({
            $not: [{itemPrice: 500}, {isInStock: false}]
        });
    
        res.send({
            successful: true,
            shopItems
        });
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    } 
});

module.exports = router;
