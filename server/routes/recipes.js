const express = require("express");
const router = express.Router();
const db = require("../database");

// Get recipes created by a user
router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    db.all(
        `
        SELECT *
        FROM recipes
        WHERE user_id = ?
        ORDER BY id DESC
        `,
        [userId],
        (err, recipes) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            recipes.forEach(recipe => {

                db.all(
                    `
                    SELECT ingredient
                    FROM ingredients
                    WHERE recipe_id = ?
                    `,
                    [recipe.id],
                    (err, ingredients) => {

                        if (!err) {
                            recipe.ingredients = ingredients.map(
                                item => item.ingredient
                            );
                        }

                    }
                );

            });

            res.json(recipes);
        }
    );

});


// Get one recipe
router.get("/:id", (req, res) => {

    const recipeId = req.params.id;

    db.get(
        `
        SELECT *
        FROM recipes
        WHERE id = ?
        `,
        [recipeId],
        (err, recipe) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (!recipe) {
                return res.status(404).json({
                    message: "Recipe not found."
                });
            }

            db.all(
                `
                SELECT ingredient
                FROM ingredients
                WHERE recipe_id = ?
                `,
                [recipeId],
                (err, ingredients) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database error."
                        });
                    }

                    db.all(
                        `
                        SELECT instruction
                        FROM instructions
                        WHERE recipe_id = ?
                        `,
                        [recipeId],
                        (err, instructions) => {

                            if (err) {
                                return res.status(500).json({
                                    message: "Database error."
                                });
                            }

                            recipe.ingredients = ingredients.map(
                                item => item.ingredient
                            );

                            recipe.instructions = instructions.map(
                                item => item.instruction
                            );

                            // Author name
                            db.get(
                                `
                                SELECT name
                                FROM users
                                WHERE id = ?
                                `,
                                [recipe.user_id],
                                (err, user) => {

                                    if (!err && user) {
                                        recipe.author = user.name;
                                    } else {
                                        recipe.author = "Unknown";
                                    }

                                    res.json(recipe);
                                }
                            );

                        }
                    );

                }
            );

        }
    );

});


// Create recipe
router.post("/", (req, res) => {

    const {
        user_id,
        title,
        description,
        category,
        time,
        servings,
        image,
        ingredients,
        instructions
    } = req.body;

    if (
        !user_id ||
        !title ||
        !description ||
        !time ||
        !servings
    ) {
        return res.status(400).json({
            message: "Missing required fields."
        });
    }

    const sql = `
        INSERT INTO recipes
        (
            user_id,
            title,
            description,
            category,
            time,
            servings,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            user_id,
            title,
            description,
            category,
            time,
            servings,
            image || ""
        ],
        function (err) {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Could not create recipe."
                });
            }

            const recipeId = this.lastID;

            // Add ingredients
            if (ingredients && ingredients.length > 0) {

                const ingredientStmt = db.prepare(`
                    INSERT INTO ingredients
                    (recipe_id, ingredient)
                    VALUES (?, ?)
                `);

                ingredients.forEach(ingredient => {
                    ingredientStmt.run(recipeId, ingredient);
                });

                ingredientStmt.finalize();
            }

            // Add instructions
            if (instructions && instructions.length > 0) {

                const instructionStmt = db.prepare(`
                    INSERT INTO instructions
                    (recipe_id, instruction)
                    VALUES (?, ?)
                `);

                instructions.forEach(instruction => {
                    instructionStmt.run(recipeId, instruction);
                });

                instructionStmt.finalize();
            }

            res.json({
                message: "Recipe created successfully.",
                recipeId: recipeId
            });

        }
    );

});


// Delete recipe
router.delete("/:id", (req, res) => {

    const recipeId = req.params.id;

    // Delete favourites
    db.run(
        `
        DELETE FROM favourites
        WHERE recipe_id = ?
        `,
        [recipeId]
    );

    // Delete ingredients
    db.run(
        `
        DELETE FROM ingredients
        WHERE recipe_id = ?
        `,
        [recipeId]
    );

    // Delete instructions
    db.run(
        `
        DELETE FROM instructions
        WHERE recipe_id = ?
        `,
        [recipeId]
    );

    // Delete recipe
    db.run(
        `
        DELETE FROM recipes
        WHERE id = ?
        `,
        [recipeId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: "Could not delete recipe."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Recipe not found."
                });
            }

            res.json({
                message: "Recipe deleted successfully."
            });

        }
    );

});

module.exports = router;