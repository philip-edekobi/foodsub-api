const { Router } = require("express");
const User = require("../models/User");
const { signIn } = require("../validations/userValidations");
const { parseError, sessionizeUser, compare } = require("../utils");

const sessionRouter = Router();

/* @route GET /api/v1/session
 * Get current session
 */
sessionRouter.get("", ({ session }, res) => {
    try {
        const { user } = session;

        if (user) res.send(user);
        else return res.status(404).json({ err: "No active user" });
    } catch (err) {
        res.status(500).send(parseError(err));
    }
});

/* @route POST /api/v1/session
 * Log In
 */
sessionRouter.post("", async ({ session, body: { email, password } }, res) => {
    try {
        if (!(email && password)) {
            return res.status(400).json({ err: "email or password missing" });
        }

        signIn.validate({ email });

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ err: "user does not exist" });
        }

        if (!compare(password, user.password)) {
            return res.status(400).json({ err: "Incorrect password" });
        }

        session.user = sessionizeUser(user);
        session.save();
        return res.status(200).send("login successful");
    } catch (err) {
        res.status(500).send(parseError(err));
    }
});

/* @route DELETE /api/v1/session
 * Log Out
 */
sessionRouter.delete("", async ({ session }, res) => {
    try {
        const user = session.user;
        if (user) {
            session.destroy(err => {
                if (err) throw err;

                res.clearCookie(process.env.SESS_NAME);
                res.status(200).send("logout completed");
            });
        } else {
            return res.status(404).json({ err: "No active user" });
        }
    } catch (err) {
        res.status(500).send(parseError(err));
    }
});

module.exports = sessionRouter;
