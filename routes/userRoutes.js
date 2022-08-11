const { Router } = require("express");
const User = require("../models/User");
const { signUp } = require("../validations/userValidations");
const { parseError, sessionizeUser, hash } = require("../utils");

const userRoutes = Router();

userRoutes.post("", async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        if (!(name && email && phoneNumber && password))
            throw new Error(
                "name, password, email and phone number are required"
            );
        signUp.validate({ name, email, phoneNumber });

        const existingUser = await User.findOne({ phoneNumber, email });

        if (existingUser) throw new Error("User already exists");

        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hash(password),
        });
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
