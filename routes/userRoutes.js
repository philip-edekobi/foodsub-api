const { Router } = require("express")

const userRoutes = Router();

userRoutes.post("", (req, res) => {
    res.send(req.body);
});

module.exports = userRoutes;