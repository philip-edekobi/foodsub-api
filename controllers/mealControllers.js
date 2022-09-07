const Meal = require('../models/Meal')
const Admin = require("../models/Admin");
const { parseError } = require("../utils");

//Get ALl Meals from DB
const getMeals = async (req, res) => {
    try {
        const meals = await Meal.find({});
        return res.status(200).json({ meals });
    } catch (error) {
        return res.status(500).send(parseError(error));
    }
}

//Get Single Meal from DB

const getMeal = async (req, res) => {
    const {id} = req.params;
    try {
        const meal = await Meal.findOne({_id: id});
        return res.status(200).json({meal});

    } catch (error) {
        return res.status(500).send(parseError(error));
    }
}

//Update a Meal on DB

const updateMeal = async (req, res) => {
    const {id} = req.params;

    try {
        const meal = await Meal.findOne({_id: id});

        for (let property in body) {
            if (property in meal) {
                meal[property] = body[property];
            }
        }

        await meal.save();

        const workingAdmin = Admin.findById(req.admin.id);

        workingAdmin.actions.push(
            `Updated meal: ${meal.name} with id: ${meal._id}`
        );

        await workingAdmin.save();

        return res.status(200).json({updatedMeal: meal});
    } catch (error) {
        return res.status(500).send(parseError(error));   
    }
}

// create meal

const createMeal = async (req, res) => {
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
}

//delete meal

const deleteMeal = async (req, res) => {
    const {id} = req.params;
    try {
        await Meal.findOneAndDelete({ id });
        return res.status(200).json({ msg: "success" });
    } catch (error) {
        return res.status(500).send(parseError(error));
    }
}

module.exports = {getMeals, createMeal, deleteMeal, updateMeal, getMeal}