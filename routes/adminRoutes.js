const { Router } = require("express");
const User = require("../models/User");
const { signUp } = require("../validations/userValidations");
const { parseError, sessionizeUser, hash } = require("../utils");

const adminRoutes = Router();

adminRoutes.post("meal", async (req, res) => {});

module.exports = adminRoutes;
