const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        state: { type: String },
        lga: { type: String },
        img: { type: String },
        bvn: { type: String },
        isConfirmed: { type: Boolean, default: false },
        password: { type: String, required: true },
        allergies: { type: [String] },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        history: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subscription",
            },
        ],
        cart: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subscription",
            },
        ],
        resAddr: [
            {
                address: String,
                landmark: String,
            },
        ],
        deliveryAddr: [
            {
                address: String,
                landmark: String,
            },
        ],
        cards: [
            {
                name: { type: String },
                cvv: { type: String }, //hashed
                cardNo: { type: String }, //hashed
            },
        ],
    },
    { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
