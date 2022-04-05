const { Router } = require("express");
const User = require("../models/User");
const { signIn } = require('../validations/userValidations');
const { parseError, sessionizeUser } = require("../utils");

const sessionRouter = Router();

sessionRouter.post("", async (req, res) => {
    try{
        const { email, password } = req.body;
        await signIn.validate({ email, password });

        const user = await User.findOne({ email });
        if (user && user.comparePasswords(password)) {
            const sessionUser = sessionizeUser(user);

            req.session = {...req.session, user: sessionUser};
            console.log(req.session);
            res.send(sessionUser);
        } else {
            throw new Error('Invalid login credentials');
        }
    } catch(err){
        res.status(401).send(parseError(err));
    }
});

sessionRouter.delete("", async ({ session }, res) => {
    try{
        const user = session.user;
        if (user) {
            session.destroy(err => {
                if (err) throw (err);

                res.clearCookie(process.env.SESS_NAME);
                res.send(user);
            });
        }
    } catch(err){
        res.status(422).send(parseError(err));
    }
});

sessionRouter.get("", ({ session }, res) => {
    console.log(session);
    res.send({ user: session.user });
});

module.exports = sessionRouter;