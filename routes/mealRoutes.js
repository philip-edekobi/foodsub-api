const { Router } = require("express");
const { adminAuth } = require("../middleware");

const mealRoutes = Router();

const {
    getMeals,
    createMeal,
    deleteMeal,
    getMeal,
    updateMeal,
} = require("../controllers/mealControllers");

/* @route GET /api/v1/meal
 * Get Meals
 */
mealRoutes.get("/", getMeals);

/* @route GET /api/v1/meal/:id
 * Get Meals
 */
mealRoutes.get("/:id", getMeal);

/* @route POST /api/v1/meal
 * Add Meal
 */
mealRoutes.post("/", adminAuth, createMeal);

/* @route PATCH /api/v1/meal/:id
 * Get Meals
 */
mealRoutes.patch("/:id", adminAuth, updateMeal);

/* @route DELETE /api/v1/meal/:id
 * Add Meal
 */
mealRoutes.delete("/:id", adminAuth, deleteMeal);

module.exports = mealRoutes;
