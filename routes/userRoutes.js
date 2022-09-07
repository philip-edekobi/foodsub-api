const { Router } = require("express");
const {createUser, updateUser} = require('../controllers/userControllers')

const userRoutes = Router();

/* @route POST /api/v1/user
 * Create user
 */
userRoutes.post("/", createUser);

/* @route PATCH /api/v1/user
 * Edit user details
 */
userRoutes.patch("/", updateUser);

module.exports = userRoutes;
