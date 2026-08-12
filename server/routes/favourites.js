const express = require("express");
const router = express.Router();
const db = require("../database");


// Get user's favourites
router.get("/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT recipes.*
        FROM recipes
        JOIN favourites
        ON recipes.id = favourites.recipe_id
        WHERE favourites.user_id = ?
        ORDER BY favourites.id DESC
    `;

    db.all(sql, [userId], (err, recipes) => {

        if (err) {
            return res.status(500).json({
                message: "Database error."
            });
        }

        // Add author name
        let completed = 0;

        if (recipes.length === 0) {
            return res.json([]);
        }

        recipes.forEach(function (recipe) {

            db.get(
                `
                SELECT name
                FROM users
                WHERE id = ?
                `,
                [recipe.user_id],
                function (err, user) {

                    if (!err && user) {
                        recipe.author = user.name;
                    } else {
                        recipe.author = "Unknown";
                    }

                    completed++;

                    if (completed === recipes.length) {
                        res.json(recipes);
                    }

                }
            );

        });

    });

});


// Add favourite
router.post("/", (req, res) => {

    const {
        user_id,
        recipe_id
    } = req.body;

    if (!user_id || !recipe_id) {
        return res.status(400).json({
            message: "Missing user or recipe."
        });
    }

    // Check if already favourite
    db.get(
        `
        SELECT id
        FROM favourites
        WHERE user_id = ?
        AND recipe_id = ?
        `,
        [user_id, recipe_id],
        (err, favourite) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (favourite) {
                return res.json({
                    message: "Recipe is already a favourite."
                });
            }

            db.run(
                `
                INSERT INTO favourites
                (user_id, recipe_id)
                VALUES (?, ?)
                `,
                [user_id, recipe_id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: "Could not add favourite."
                        });
                    }

                    res.json({
                        message: "Recipe added to favourites."
                    });

                }
            );

        }
    );

});


// Remove favourite
router.delete("/", (req, res) => {

    const {
        user_id,
        recipe_id
    } = req.body;

    if (!user_id || !recipe_id) {
        return res.status(400).json({
            message: "Missing user or recipe."
        });
    }

    db.run(
        `
        DELETE FROM favourites
        WHERE user_id = ?
        AND recipe_id = ?
        `,
        [user_id, recipe_id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: "Could not remove favourite."
                });
            }

            res.json({
                message: "Recipe removed from favourites."
            });

        }
    );

});


// Remove favourite using URL parameters
router.delete("/:userId/:recipeId", (req, res) => {

    const {
        userId,
        recipeId
    } = req.params;

    db.run(
        `
        DELETE FROM favourites
        WHERE user_id = ?
        AND recipe_id = ?
        `,
        [userId, recipeId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: "Could not remove favourite."
                });
            }

            res.json({
                message: "Recipe removed from favourites."
            });

        }
    );

});


module.exports = router;