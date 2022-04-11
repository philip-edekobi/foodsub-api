const { Router } = require("express");
const User = require("../models/User");
const { signUp } = require('../validations/userValidations');
const { parseError, sessionizeUser } = require("../utils");

const userRoutes = Router();

userRoutes.post("", async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        await signUp.validate({ name, email, phoneNumber });

        const newUser = new User({ name, email, phoneNumber });
        await newUser.save();
        
        const sessionUser = sessionizeUser(newUser);
        req.session.user = sessionUser;
        req.session.save();
        res.send(sessionUser);
    } catch (err) {
        res.status(400).send(parseError(err));  
    }
});

module.exports = userRoutes;