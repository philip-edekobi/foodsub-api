const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: { type: String },
        state: { type: String },
        lga: { type: String },
        img: { type: String },
        bvn: { type: String },
        password: { type: String },
        allergies: { type: [String] },
        email: {
            type: String,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "NORMAL", "SERVICE PROVIDER"],
            default: "NORMAL",
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
                cardNo: { type: String },
            },
        ]
    },
    { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
