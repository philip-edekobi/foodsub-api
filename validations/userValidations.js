const Joi = require("joi");

const email = Joi.string().email().required();

const name = Joi.string().alphanum().min(3).max(30).required();

const password = Joi.string();

const phoneNumber = Joi.string().regex(
    /^(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}$/
);

const signUp = Joi.object().keys({
    email,
    name,
    phoneNumber,
});

const signIn = Joi.object().keys({
    email,
    phoneNumber,
});

const addNumber = Joi.object().keys({
    phoneNumber,
});

module.exports = {
    signUp,
    signIn,
    addNumber,
};
