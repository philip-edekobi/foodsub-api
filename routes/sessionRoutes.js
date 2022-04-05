const { Router } = require("express");
const User = require("../models/User");
const { signIn } = require('../validations/userValidations');
const { parseError, sessionizeUser } = require("../utils");

const sessionRouter = Router();

sessionRouter.post("/login/", async (req, res) => {
    try{
        const { email, password } = req.body;
        await signIn.validate({ email, password });

        const user = await User.findOne({ email });
        if (user && user.comparePasswords(password)) {
            const sessionUser = sessionizeUser(user);

            req.session.user = sessionUser;
            res.status(201).send(sessionUser);
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
        } else {
            throw new Error("No active user")
        }
    } catch(err){
        res.status(404).send(parseError(err));
    }
});

sessionRouter.get("/active/", ({ session }, res) => {
    try{
        const { user } = session;
        console.log(session);

        if(user) res.send({ user });
        else throw new Error("No active user");
    }catch(err){
        res.status(404).send(parseError(err));
    }
});

module.exports = sessionRouter;