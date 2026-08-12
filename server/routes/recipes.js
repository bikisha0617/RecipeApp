const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../database");

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image upload settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);

        const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            extension;

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// Get recipes created by a user
router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    db.all(
        `SELECT * FROM recipes WHERE user_id = ? ORDER BY id DESC`,
        [userId],
        (err, recipes) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            recipes.forEach(recipe => {

                if (recipe.image) {

                    if (
                        recipe.image.startsWith("http://") ||
                        recipe.image.startsWith("https://")
                    ) {
                        // Already a complete URL
                    } else if (recipe.image.startsWith("/uploads/")) {

                        recipe.image =
                            `http://localhost:3000${recipe.image}`;

                    } else {

                        recipe.image =
                            `http://localhost:3000/uploads/${recipe.image}`;
                    }
                }
            });

            res.json(recipes);
        }
    );
});


// Get one recipe
router.get("/:id", (req, res) => {

    const recipeId = req.params.id;

    db.get(
        `SELECT * FROM recipes WHERE id = ?`,
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

            // Get ingredients
            db.all(
                `SELECT ingredient
                 FROM ingredients
                 WHERE recipe_id = ?
                 ORDER BY rowid ASC`,
                [recipeId],
                (err, ingredients) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database error."
                        });
                    }

                    // Get instructions
                    db.all(
                        `SELECT instruction
                         FROM instructions
                         WHERE recipe_id = ?
                         ORDER BY rowid ASC`,
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

                            // Convert image to usable URL
                            if (recipe.image) {

                                if (
                                    recipe.image.startsWith("http://") ||
                                    recipe.image.startsWith("https://")
                                ) {
                                    // Already complete
                                } else if (
                                    recipe.image.startsWith("/uploads/")
                                ) {

                                    recipe.image =
                                        `http://localhost:3000${recipe.image}`;

                                } else {

                                    recipe.image =
                                        `http://localhost:3000/uploads/${recipe.image}`;
                                }

                            } else {

                                recipe.image =
                                    "images/placeholder.jpg";
                            }

                            res.json(recipe);
                        }
                    );
                }
            );
        }
    );
});


// Create recipe
router.post("/", upload.single("image"), (req, res) => {

    const {
        user_id,
        title,
        description,
        category,
        time,
        servings,
        difficulty,
        calories,
        protein,
        carbs,
        fat,
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

        // Remove uploaded image if validation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
            message: "Missing required fields."
        });
    }

    let image = null;

    if (req.file) {
        image = req.file.filename;
    }

    let ingredientArray = [];

    let instructionArray = [];

    try {

        ingredientArray =
            ingredients ? JSON.parse(ingredients) : [];

    } catch (error) {

        ingredientArray = [];
    }

    try {

        instructionArray =
            instructions ? JSON.parse(instructions) : [];

    } catch (error) {

        instructionArray = [];
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
            difficulty,
            image,
            calories,
            protein,
            carbs,
            fat
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            difficulty || "Easy",
            image,
            Number(calories) || 0,
            Number(protein) || 0,
            Number(carbs) || 0,
            Number(fat) || 0
        ],
        function (err) {

            if (err) {

                // Delete uploaded image if database insert fails
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                console.error("Create recipe database error:", err);

                return res.status(500).json({
                    message: "Could not create recipe."
                });
            }

            const recipeId = this.lastID;

            // Insert ingredients
            if (ingredientArray.length > 0) {

                const ingredientStmt = db.prepare(
                    `INSERT INTO ingredients
                     (recipe_id, ingredient)
                     VALUES (?, ?)`
                );

                ingredientArray.forEach(ingredient => {

                    if (ingredient.trim() !== "") {

                        ingredientStmt.run(
                            recipeId,
                            ingredient.trim()
                        );
                    }
                });

                ingredientStmt.finalize();
            }

            // Insert instructions
            if (instructionArray.length > 0) {

                const instructionStmt = db.prepare(
                    `INSERT INTO instructions
                     (recipe_id, instruction)
                     VALUES (?, ?)`
                );

                instructionArray.forEach(instruction => {

                    if (instruction.trim() !== "") {

                        instructionStmt.run(
                            recipeId,
                            instruction.trim()
                        );
                    }
                });

                instructionStmt.finalize();
            }

            res.json({
                message: "Recipe created successfully.",
                recipeId: recipeId,
                image: image
                    ? `http://localhost:3000/uploads/${image}`
                    : null
            });
        }
    );
});


// Delete recipe
router.delete("/:id", (req, res) => {

    const recipeId = req.params.id;

    // Get image before deleting recipe
    db.get(
        `SELECT image FROM recipes WHERE id = ?`,
        [recipeId],
        (err, recipe) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            // Delete ingredients
            db.run(
                `DELETE FROM ingredients WHERE recipe_id = ?`,
                [recipeId]
            );

            // Delete instructions
            db.run(
                `DELETE FROM instructions WHERE recipe_id = ?`,
                [recipeId]
            );

            // Delete favourites
            db.run(
                `DELETE FROM favourites WHERE recipe_id = ?`,
                [recipeId]
            );

            // Delete recipe
            db.run(
                `DELETE FROM recipes WHERE id = ?`,
                [recipeId],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: "Could not delete recipe."
                        });
                    }

                    // Delete image file
                    if (recipe && recipe.image) {

                        const imagePath =
                            path.join(uploadDir, recipe.image);

                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    }

                    res.json({
                        message: "Recipe deleted successfully."
                    });
                }
            );
        }
    );
});


module.exports = router;