const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: ["Premium Meals", "Discounted Meals", "Top Picks"],
        },
        description: {
            type: String,
            required: true,
        },
        ingredients: {
            type: [String],
        },
        image: {
            type: Schema.Types.Buffer,
            required: true,
        },
        discount: {
            type: Number,
        },
        /*cookingPreference: {
            type: String,
        },
        dailyValue: {
            type: String,
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
        },*/
    },
    { timestamps: true }
);

const Meal = model("Meal", mealSchema);

module.exports = Meal;
