const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        categories: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        }],
        desc: {
            type: String,
            required: true,
        },
        cookingPreference: {
            type: String,
        },
        dailyValue: {
            type: String,
        },
        ingredients: {
            type: [String],
        },
        extraAdditions: {
            type: [String],
        },
        nutritionInfo: {
            type: [
                {
                    nutrient: { type: String },
                    value: { type: String },
                },
            ],
        },
    },
    { timestamps: true }
);

const Meal = model("Meal", mealSchema);

module.exports = Meal;
