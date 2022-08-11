const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    plans: {
        Monday: [plan],
        Tuesday: [plan],
        Wednesday: [plan],
        Thursday: [plan],
        Friday: [plan],
        Saturday: [plan],
        Sunday: [plan]
    }
}, { timestamps: true });

const plan = {
    meal: {
        type: Schema.Types.ObjectId,
    }, 
    status: {
        type: Schema.Types.String,
        enum: ["PLAY", "PAUSE", "DELIVERED"]
    },
    start: {
        type: Schema.Types.Date
    },
    end: {
        type: Schema.Types.Date
    }
}

const Subscription = model("Subscription", subscriptionSchema);

module.exports = Subscription;
