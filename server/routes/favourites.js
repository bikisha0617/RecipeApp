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

            console.error(
                "Get favourites error:",
                err
            );

            return res.status(500).json({
                message: "Database error."
            });
        }

        res.json(recipes);
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
            message: "User ID and recipe ID are required."
        });
    }


    // Check recipe exists
    db.get(
        `SELECT id FROM recipes WHERE id = ?`,
        [recipe_id],
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


            // Add favourite
            db.run(
                `
                INSERT OR IGNORE INTO favourites
                (user_id, recipe_id)
                VALUES (?, ?)
                `,
                [
                    user_id,
                    recipe_id
                ],
                function (err) {

                    if (err) {

                        console.error(
                            "Add favourite error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Could not add favourite."
                        });
                    }

                    res.json({
                        message:
                            "Recipe added to favourites."
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
            message:
                "User ID and recipe ID are required."
        });
    }


    db.run(
        `
        DELETE FROM favourites
        WHERE user_id = ?
        AND recipe_id = ?
        `,
        [
            user_id,
            recipe_id
        ],
        function (err) {

            if (err) {

                console.error(
                    "Remove favourite error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Could not remove favourite."
                });
            }

            res.json({
                message:
                    "Recipe removed from favourites."
            });
        }
    );
});


module.exports = router;