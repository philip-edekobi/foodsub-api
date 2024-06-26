const { Schema, model } = require("mongoose");

const plan = {
    meal: {
        type: Schema.Types.ObjectId,
        ref: "meal",
    },

    deliveryTime: {
        type: [Number],
    },

    deliveryMethod: {
        type: String,
        enum: ["pick up", "home delivery"],
        required: true,
    },
};

const subscriptionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            enum: ["triweekly", "daily", "weekends"],
        },
        plans: {
            Monday: [plan],
            Tuesday: [plan],
            Wednesday: [plan],
            Thursday: [plan],
            Friday: [plan],
            Saturday: [plan],
            Sunday: [plan],
        },

        startDate: {
            type: Schema.Types.Date,
            default: Date.now(),
        },

        endDate: {
            type: Schema.Types.Date,
        },
    },
    { timestamps: true }
);

// const query = {
//     "user": "",
//     "type": "triweekly",
//     "plans": {
//         "Monday": {
//             "meal": {

//             },

//              "deliveryTime": {

//              },

//              "deliveryMethod": {
//              }
//         },
//         "Wednesday": {
//             "meal": {

//             },

//              "deliveryTime": {

//              },

//              "deliveryMethod": {
//              }
//         }
//     },
//     "startDate": "",
//     "endDate": ""
//  }

const Subscription = model("Subscription", subscriptionSchema);

module.exports = Subscription;
