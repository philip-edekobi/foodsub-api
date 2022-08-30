const { Router } = require("express");
const Meal = require("../models/Meal");
const Admin = require("../models/Admin");
const { signUp } = require("../validations/userValidations");
const { parseError, hash, sessionizeUser } = require("../utils");
const { adminAuth } = require("../middleware");

const adminRoutes = Router();

/* @route POST /api/v1/admin/
 * Create Admin
 */
adminRoutes.post("", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        signUp.validate({ name, email });
        const existingAdmin = await Admin.findOne({ name, email });

        if (existingAdmin) {
            return res.status(409).json({ err: "admin already exists" });
        }

        const admin = new Admin({});
    } catch (error) {
        res.status(500).json(error);
    }
});

/* @route POST /api/v1/admin/meal
 * Add Meal
 */
adminRoutes.post("/meal", adminAuth, async (req, res) => {
    const { name, price, ingredients, description, category, img } = req.body;
    try {
        if (!(name && price && ingredients && description)) {
            return res.status(400).json({ msg: "incomplete fields!" });
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
        res.status(500).json({ err: parseError(err) });
    }
});

module.exports = adminRoutes;
