const { model, Schema } = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    meals: [
        {
            type: Schema.Types.ObjectId,
            ref: "Meal",
        },
    ],
});

const Category = model(categorySchema);

module.exports = Category;

//this needs a re-evaluation
