const { Router } = require("express");
const Joi = require("joi");
const User = require("../models/User");
const { signUp } = require('../validations/userValidations');

const userRoutes = Router();

userRoutes.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await signUp.validate({ name, email, password });

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.send({ userId: newUser.id, name });
    } catch (err) {
        res.status(400).send(err);  
        console.log(err);
    }
});

module.exports = userRoutes;