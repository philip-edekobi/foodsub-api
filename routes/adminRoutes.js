const { Router } = require("express");
const Meal = require("../models/Meal");
const { signUp } = require("../validations/userValidations");
const { parseError, sessionizeUser, hash } = require("../utils");
const { adminAuth } = require("../middleware");

const adminRoutes = Router();

/* @route POST /api/v1/admin/meal
 * Log In
 */
adminRoutes.post("/meal", adminAuth, async (req, res) => {
    const { name, price, ingredients, description, category, img } = req.body;
    try {
        if (!((name && price) /*&& ingredients && description*/)) {
            throw new Error("incomplete fields!");
        }
        console.log(img ?? "no image");

        const meal = new Meal({
            name,
            price,
            ingredients,
            description,
            category: category ?? undefined,
            image: img,
        });
        await meal.save();
        res.status(201).json({ msg: "meal added successfully!" });
    } catch (err) {
        res.status(400).json({ err: parseError(err) });
    }
});

module.exports = adminRoutes;
