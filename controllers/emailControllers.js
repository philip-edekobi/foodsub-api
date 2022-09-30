const User = require("../models/User");
const { sendMail, generateCode } = require("../utils");

const sendEmail = async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res
            .status(400)
            .json({ err: "you do not have access to this url endpoint" });
    }

    try {
        const { email, isConfirmed } = await User.findById(user.id);
        if (isConfirmed) {
            return res.status(400).json({ err: "already confirmed" });
        }

        const pin = generateCode(4);

        req.session.pin = pin;

        await sendMail(email, pin);

        return res.status(200).json({ pin });
    } catch (error) {
        return res.status(500).json({ err: "internal server error" });
    }
};

const verifyCode = async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({
            err: "you do not have access to this url endpoint",
        });
    }

    try {
        const { code } = req.body;
        if (!code)
            return res
                .status(400)
                .json({ err: "'code' field can not be empty" });

        const currentUser = await User.findById(req.session.user.id);

        if (currentUser.isConfirmed) {
            return res.status(403).json({
                err: "this resource is not allowed for confirmed users",
            });
        }

        if (code !== req.session.pin) {
            return res
                .status(400)
                .json({ err: "sorry, the provided code is invalid" });
        }

        if (code === req.session.pin) {
            currentUser.isConfirmed = true;
            await currentUser.save();
            req.session.pin = null;

            return res.status(200).send("success!");
        }
    } catch (error) {
        return res.status(500).json({ err: "internal server error" });
    }
};

module.exports = {
    sendEmail,
    verifyCode,
};
