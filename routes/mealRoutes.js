const { Router } = require("express");
const Meal = require("../models/Meal");
const Admin = require("../models/Admin");
const { parseError } = require("../utils");
const { adminAuth } = require("../middleware");

const mealRoutes = Router();

/* @route POST /api/v1/meal
 * Add Meal
 */

mealRoutes.post("", adminAuth, async (req, res) => {
    const { name, price, ingredients, description, category, img } = req.body;
    try {
        if (!(name && price && ingredients && description)) {
            return res.status(400).json({ err: "incomplete fields!" });
        }

        const existingMeal = await Meal.findOne({ name });

        if (existingMeal) {
            return res.status(409).json({ err: "meal already exists" });
        }

        const meal = new Meal({
            name,
            price,
            ingredients,
            description,
            category: category ?? undefined,
            image: img,
        });
        await meal.save();

        const workingAdmin = Admin.findById(req.admin.id);

        workingAdmin.actions.push(
            `Added meal: ${meal.name} with id: ${meal._id}`
        );

        await workingAdmin.save();
        res.status(201).json({ msg: "meal added successfully!" });
    } catch (err) {
        res.status(500).json({ err: parseError(err) });
    }
});

module.exports = mealRoutes;
