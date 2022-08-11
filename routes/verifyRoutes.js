    const { Router } = require("express");
    const User = require("../models/User");
    const { addNumber } = require('../validations/userValidations');
    const { parseError, sessionizeUser, sendSms } = require("../utils");

    const verifyRoutes = Router();

    verifyRoutes.post("/dispatchCode", async (req, res) => {
        try {
            const { phoneNumber } = req.body;
            await addNumber.validate({ phoneNumber });
            
            let pin = (Math.floor(Math.random() * 10000) + 9999).toString();
            pin = pin.length !== 4 ? pin = pin.slice(1) : pin;  
            const resp = await sendSms(phoneNumber, pin);

            req.session.pin = pin;

            res.status(200).send({ message: "code sent" });
        } catch (err){
            res.status(500).send(parseError(err));
        }
    });

    verifyRoutes.post("/verify", async (req, res) => {
        try{
            const { phoneNumber, code } = req.body;
            if(code === req.session.pin){
                let user = await User.findOne({ phoneNumber });
                if(user){
                    const sessionUser = sessionizeUser(user);

                    req.session.user = sessionUser;
                    req.session.save();
                    res.status(200).send(sessionUser);
                } else {
                    res.status(200).send({ message: "proceed to sign up"});
                }
            } else {
                res.status(400).send({ error: "wrong code"})
            }
        } catch(err){
            res.status(500).send(parseError(err));
        }
    });

    module.exports = verifyRoutes;