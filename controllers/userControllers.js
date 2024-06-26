const User = require("../models/User");
const { signUp } = require("../validations/userValidations");
const { parseError, sessionizeUser, hash } = require("../utils");

const createUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, state, lga, allergies } =
            req.body;

        if (!(name && email && phoneNumber && password)) {
            return res.status(400).json({ err: "incomplete fields" });
        }
        signUp.validate({ name, email, phoneNumber });

        const existingUser = await User.findOne({ phoneNumber, email });

        if (existingUser)
            return res.status(409).json({ err: "User already exists" });

        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hash(password),
            state,
            lga,
            allergies,
        });
        await newUser.save();

        const sessionUser = sessionizeUser(newUser);
        req.session.user = sessionUser;
        req.session.cookie.maxAge = 15768000000; //set cookie to expire in a year;
        req.session.save();
        res.status(201).json(sessionUser);
    } catch (err) {
        res.status(500).send(parseError(err));
    }
};

const updateUser = async ({ session: { user }, body }, res) => {
    if (!user) {
        return res
            .status(401)
            .json({ err: "you do not have access to this url endpoint" });
    }

    try {
        const currentUser = await User.findById(user.userId);
        for (let property in body) {
            if (property in currentUser) {
                currentUser[property] = body[property];
            }
        }
        await currentUser.save();
        res.status(206).send({ msg: "operation successful" });
    } catch (err) {
        res.status(500).send(parseError(err));
    }
};

module.exports = { createUser, updateUser };
