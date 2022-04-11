const { Router } = require("express");
const User = require("../models/User");
const { signIn } = require('../validations/userValidations');
const { parseError } = require("../utils");

const sessionRouter = Router();

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

        if(user) res.send(user);
        else throw new Error("No active user");
    }catch(err){
        res.status(404).send(parseError(err));
    }
});

module.exports = sessionRouter;