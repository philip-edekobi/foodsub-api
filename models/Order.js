const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "subscription",
    },

    meal: {
        type: Schema.Types.ObjectId,
        ref: "meal",
    },

    deliveryTime: {
        type: Schema.Types.Date,
    },

    status: {
        type: String,
        enum: [
            "accepted",
            "progressed",
            "on the way",
            "delivered",
            "cancelled",
        ],
        // 'new' wasnt passed as an enum because I would like to decide which order is new during the actual request
        // for instance /api/v1/order?new=true?date={Date.now} if Date.now is far greater than orderDate, then it isnt new
    },

    deliveryCost: {
        type: Number,
    },

    totalCost: {
        type: Number,
    },

    hasExpired: {
        type: Boolean,
        default: true,
    },
});

orderSchema.pre("save", async function () {
    const { price: cost } = await Meal.findOne({ _id: this.meal });
    this.totalCost = cost + deliveryCost;
});

const Order = model("order", orderSchema);

module.exports = Order;
