const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../database");


// =====================================================
// Upload Directory
// =====================================================

const uploadDir =
    path.join(__dirname, "..", "uploads");


if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );
}


// =====================================================
// Multer Storage
// =====================================================

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                uploadDir
            );
        },


        filename: function (
            req,
            file,
            cb
        ) {

            const extension =
                path.extname(
                    file.originalname
                );


            const filename =
                Date.now() +
                "-" +
                Math.round(
                    Math.random() * 1E9
                ) +
                extension;


            cb(
                null,
                filename
            );
        }
    });


// =====================================================
// Multer Upload
// =====================================================

const upload =
    multer({

        storage: storage,

        fileFilter:
            function (
                req,
                file,
                cb
            ) {

                const allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    allowedTypes.includes(
                        file.mimetype
                    )
                ) {

                    cb(
                        null,
                        true
                    );

                } else {

                    cb(
                        new Error(
                            "Only JPG, JPEG, PNG and WEBP images are allowed."
                        )
                    );
                }
            },


        limits: {
            fileSize:
                5 * 1024 * 1024
        }
    });


// =====================================================
// Convert Database Image to URL
// =====================================================

function getImageUrl(image) {

    if (!image) {
        return null;
    }


    image =
        String(image).trim();


    if (image === "") {
        return null;
    }


    // Already complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;
    }


    // If it contains /uploads/
    if (
        image.includes("/uploads/")
    ) {

        const filename =
            image
                .split("/uploads/")
                .pop();


        return (
            "http://localhost:3000/uploads/" +
            path.basename(filename)
        );
    }


    // uploads/filename
    if (
        image.startsWith("uploads/")
    ) {

        return (
            "http://localhost:3000/" +
            image
        );
    }


    // Filename only
    return (
        "http://localhost:3000/uploads/" +
        path.basename(image)
    );
}


// =====================================================
// Get User Recipes
// =====================================================

router.get(
    "/user/:userId",
    (req, res) => {

        const userId =
            req.params.userId;


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

                    console.error(
                        "Get user recipes error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Database error."
                    });
                }


                recipes.forEach(
                    function (recipe) {

                        recipe.image =
                            getImageUrl(
                                recipe.image
                            );
                    }
                );


                res.json(
                    recipes
                );
            }
        );
    }
);


// =====================================================
// Get One Recipe
// =====================================================

router.get(
    "/:id",
    (req, res) => {

        const recipeId =
            req.params.id;


        db.get(
            `
            SELECT *
            FROM recipes
            WHERE id = ?
            `,
            [recipeId],

            (err, recipe) => {

                if (err) {

                    console.error(
                        "Get recipe error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Database error."
                    });
                }


                if (!recipe) {

                    return res.status(404).json({
                        message:
                            "Recipe not found."
                    });
                }


                // ===============================
                // Ingredients
                // ===============================

                db.all(
                    `
                    SELECT ingredient
                    FROM ingredients
                    WHERE recipe_id = ?
                    ORDER BY rowid ASC
                    `,
                    [recipeId],

                    (err, ingredients) => {

                        if (err) {

                            console.error(
                                "Get ingredients error:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Database error."
                            });
                        }


                        // ===============================
                        // Instructions
                        // ===============================

                        db.all(
                            `
                            SELECT instruction
                            FROM instructions
                            WHERE recipe_id = ?
                            ORDER BY rowid ASC
                            `,
                            [recipeId],

                            (err, instructions) => {

                                if (err) {

                                    console.error(
                                        "Get instructions error:",
                                        err
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Database error."
                                    });
                                }


                                recipe.ingredients =
                                    ingredients.map(
                                        function (item) {

                                            return item.ingredient;
                                        }
                                    );


                                recipe.instructions =
                                    instructions.map(
                                        function (item) {

                                            return item.instruction;
                                        }
                                    );


                                // Convert image
                                recipe.image =
                                    getImageUrl(
                                        recipe.image
                                    );


                                res.json(
                                    recipe
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);


// =====================================================
// Create Recipe
// =====================================================

router.post(
    "/",
    upload.single("image"),
    (req, res) => {

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


        // ===============================
        // Validation
        // ===============================

        if (
            !user_id ||
            !title ||
            !description ||
            !time ||
            !servings
        ) {

            if (req.file) {

                fs.unlink(
                    req.file.path,
                    function () {}
                );
            }


            return res.status(400).json({
                message:
                    "Missing required fields."
            });
        }


        // ===============================
        // Image Filename
        // ===============================

        let image = null;


        if (req.file) {

            image =
                req.file.filename;
        }


        // ===============================
        // Parse Ingredients
        // ===============================

        let ingredientArray = [];


        try {

            ingredientArray =
                ingredients
                    ? JSON.parse(ingredients)
                    : [];

        } catch (error) {

            console.error(
                "Ingredient JSON error:",
                error
            );

            ingredientArray = [];
        }


        // ===============================
        // Parse Instructions
        // ===============================

        let instructionArray = [];


        try {

            instructionArray =
                instructions
                    ? JSON.parse(instructions)
                    : [];

        } catch (error) {

            console.error(
                "Instruction JSON error:",
                error
            );

            instructionArray = [];
        }


        // ===============================
        // Insert Recipe
        // ===============================

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
                category || "",
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

                    console.error(
                        "Create recipe database error:",
                        err
                    );


                    if (req.file) {

                        fs.unlink(
                            req.file.path,
                            function () {}
                        );
                    }


                    return res.status(500).json({
                        message:
                            "Could not create recipe."
                    });
                }


                const recipeId =
                    this.lastID;


                // ===============================
                // Insert Ingredients
                // ===============================

                if (
                    Array.isArray(
                        ingredientArray
                    ) &&
                    ingredientArray.length > 0
                ) {

                    const ingredientStmt =
                        db.prepare(
                            `
                            INSERT INTO ingredients
                            (
                                recipe_id,
                                ingredient
                            )
                            VALUES (?, ?)
                            `
                        );


                    ingredientArray.forEach(
                        function (ingredient) {

                            if (
                                typeof ingredient ===
                                "string" &&
                                ingredient.trim() !== ""
                            ) {

                                ingredientStmt.run(
                                    recipeId,
                                    ingredient.trim()
                                );
                            }
                        }
                    );


                    ingredientStmt.finalize();
                }


                // ===============================
                // Insert Instructions
                // ===============================

                if (
                    Array.isArray(
                        instructionArray
                    ) &&
                    instructionArray.length > 0
                ) {

                    const instructionStmt =
                        db.prepare(
                            `
                            INSERT INTO instructions
                            (
                                recipe_id,
                                instruction
                            )
                            VALUES (?, ?)
                            `
                        );


                    instructionArray.forEach(
                        function (instruction) {

                            if (
                                typeof instruction ===
                                "string" &&
                                instruction.trim() !== ""
                            ) {

                                instructionStmt.run(
                                    recipeId,
                                    instruction.trim()
                                );
                            }
                        }
                    );


                    instructionStmt.finalize();
                }


                // ===============================
                // Response
                // ===============================

                res.status(201).json({

                    message:
                        "Recipe created successfully.",

                    recipeId:
                        recipeId,

                    image:
                        getImageUrl(
                            image
                        )
                });
            }
        );
    }
);


// =====================================================
// Delete Recipe
// =====================================================

router.delete(
    "/:id",
    (req, res) => {

        const recipeId =
            req.params.id;


        // ===============================
        // Get Image
        // ===============================

        db.get(
            `
            SELECT image
            FROM recipes
            WHERE id = ?
            `,
            [recipeId],

            (err, recipe) => {

                if (err) {

                    return res.status(500).json({
                        message:
                            "Database error."
                    });
                }


                // ===============================
                // Delete Ingredients
                // ===============================

                db.run(
                    `
                    DELETE FROM ingredients
                    WHERE recipe_id = ?
                    `,
                    [recipeId]
                );


                // ===============================
                // Delete Instructions
                // ===============================

                db.run(
                    `
                    DELETE FROM instructions
                    WHERE recipe_id = ?
                    `,
                    [recipeId]
                );


                // ===============================
                // Delete Favourites
                // ===============================

                db.run(
                    `
                    DELETE FROM favourites
                    WHERE recipe_id = ?
                    `,
                    [recipeId]
                );


                // ===============================
                // Delete Recipe
                // ===============================

                db.run(
                    `
                    DELETE FROM recipes
                    WHERE id = ?
                    `,
                    [recipeId],

                    function (err) {

                        if (err) {

                            return res.status(500).json({
                                message:
                                    "Could not delete recipe."
                            });
                        }


                        // ===============================
                        // Delete Image
                        // ===============================

                        if (
                            recipe &&
                            recipe.image
                        ) {

                            let filename =
                                recipe.image;


                            if (
                                filename.includes(
                                    "/uploads/"
                                )
                            ) {

                                filename =
                                    filename
                                        .split(
                                            "/uploads/"
                                        )
                                        .pop();
                            }


                            filename =
                                path.basename(
                                    filename
                                );


                            const imagePath =
                                path.join(
                                    uploadDir,
                                    filename
                                );


                            if (
                                fs.existsSync(
                                    imagePath
                                )
                            ) {

                                fs.unlink(
                                    imagePath,
                                    function (error) {

                                        if (error) {

                                            console.error(
                                                "Could not delete image:",
                                                error
                                            );
                                        }
                                    }
                                );
                            }
                        }


                        res.json({
                            message:
                                "Recipe deleted successfully."
                        });
                    }
                );
            }
        );
    }
);


// =====================================================
// Multer Error Handler
// =====================================================

router.use(
    function (
        error,
        req,
        res,
        next
    ) {

        if (
            error instanceof multer.MulterError
        ) {

            return res.status(400).json({
                message:
                    error.message
            });
        }


        if (error) {

            console.error(
                "Recipe upload error:",
                error
            );


            return res.status(400).json({
                message:
                    error.message ||
                    "Image upload failed."
            });
        }


        next();
    }
);


module.exports = router;