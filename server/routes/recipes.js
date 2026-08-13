const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    Recipe,
    Ingredient,
    Instruction
} = require("../models");

const {
    authenticateToken,
    requireUser,
    requireAdmin
} = require("../middleware/auth");


const router = express.Router();


/*
=====================================================
UPLOAD DIRECTORY
=====================================================
*/

const uploadDir = path.join(
    __dirname,
    "..",
    "uploads"
);


if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );

}


/*
=====================================================
MULTER STORAGE
=====================================================
*/

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            callback
        ) {

            callback(
                null,
                uploadDir
            );

        },


        filename: function (
            req,
            file,
            callback
        ) {

            const extension =
                path.extname(
                    file.originalname
                ).toLowerCase();


            const filename =
                Date.now() +
                "-" +
                Math.round(
                    Math.random() * 1E9
                ) +
                extension;


            callback(
                null,
                filename
            );

        }

    });


/*
=====================================================
MULTER
=====================================================
*/

const upload =
    multer({

        storage: storage,

        fileFilter:
            function (
                req,
                file,
                callback
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

                    callback(
                        null,
                        true
                    );

                } else {

                    callback(
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


/*
=====================================================
IMAGE URL
=====================================================
*/

function getImageUrl(image) {

    if (!image) {
        return null;
    }


    const cleanImage =
        String(image).trim();


    if (!cleanImage) {
        return null;
    }


    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {

        return cleanImage;

    }


    return (
        "http://localhost:3000/uploads/" +
        path.basename(cleanImage)
    );

}


/*
=====================================================
DELETE IMAGE FILE
=====================================================
*/

function deleteImageFile(image) {

    if (!image) {
        return;
    }


    const filename =
        path.basename(
            String(image)
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
                        error.message
                    );

                }

            }
        );

    }

}


/*
=====================================================
VALIDATE RECIPE DATA
=====================================================
*/

function validateRecipeData(
    data
) {

    const {
        title,
        description,
        time,
        servings,
        difficulty
    } = data;


    if (
        !title ||
        typeof title !== "string" ||
        title.trim().length < 2
    ) {

        return "Recipe title must be at least 2 characters.";

    }


    if (
        title.trim().length > 150
    ) {

        return "Recipe title cannot exceed 150 characters.";

    }


    if (
        !description ||
        typeof description !== "string" ||
        description.trim().length < 5
    ) {

        return "Recipe description must be at least 5 characters.";

    }


    if (
        !time ||
        typeof time !== "string"
    ) {

        return "Cooking time is required.";

    }


    if (
        !servings ||
        typeof servings !== "string"
    ) {

        return "Servings are required.";

    }


    if (
        difficulty &&
        ![
            "Easy",
            "Medium",
            "Hard"
        ].includes(difficulty)
    ) {

        return "Difficulty must be Easy, Medium or Hard.";

    }


    return null;

}


/*
=====================================================
PARSE ARRAY
=====================================================
*/

function parseArray(value) {

    if (
        Array.isArray(value)
    ) {

        return value;

    }


    if (
        typeof value !== "string" ||
        value.trim() === ""
    ) {

        return [];

    }


    try {

        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


/*
=====================================================
CLEAN ARRAY
=====================================================
*/

function cleanStringArray(
    values
) {

    if (
        !Array.isArray(values)
    ) {

        return [];

    }


    return values

        .filter(
            function (value) {

                return (
                    typeof value === "string" &&
                    value.trim() !== ""
                );

            }
        )

        .map(
            function (value) {

                return value.trim();

            }
        );

}


/*
=====================================================
FORMAT RECIPE
=====================================================
*/

function formatRecipe(recipe) {

    const plainRecipe =
        recipe.toJSON();


    plainRecipe.user_id =
        plainRecipe.userId;

    delete plainRecipe.userId;


    plainRecipe.image =
        getImageUrl(
            plainRecipe.image
        );


    if (
        plainRecipe.ingredients
    ) {

        plainRecipe.ingredients =
            plainRecipe.ingredients.map(
                function (item) {

                    return item.ingredient;

                }
            );

    } else {

        plainRecipe.ingredients = [];

    }


    if (
        plainRecipe.instructions
    ) {

        plainRecipe.instructions =
            plainRecipe.instructions.map(
                function (item) {

                    return item.instruction;

                }
            );

    } else {

        plainRecipe.instructions = [];

    }


    return plainRecipe;

}


/*
=====================================================
GET ALL RECIPES
=====================================================
*/

router.get(
    "/",
    async function (req, res) {

        try {

            const recipes =
                await Recipe.findAll({

                    include: [

                        {
                            model: Ingredient,
                            as: "ingredients",

                            attributes: [
                                "ingredient"
                            ]
                        },

                        {
                            model: Instruction,
                            as: "instructions",

                            attributes: [
                                "instruction"
                            ]
                        }

                    ],

                    order: [
                        [
                            "id",
                            "DESC"
                        ]
                    ]

                });


            return res.json(
                recipes.map(
                    formatRecipe
                )
            );

        } catch (error) {

            console.error(
                "Get all recipes error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not retrieve recipes."
            });

        }

    }
);


/*
=====================================================
GET USER RECIPES
=====================================================
*/

router.get(
    "/user/:userId",

    authenticateToken,

    requireUser,

    async function (req, res) {

        try {

            const requestedUserId =
                Number(
                    req.params.userId
                );


            if (
                requestedUserId !==
                Number(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You can only access your own recipes."
                });

            }


            const recipes =
                await Recipe.findAll({

                    where: {
                        userId:
                            req.user.id
                    },

                    include: [

                        {
                            model: Ingredient,
                            as: "ingredients",

                            attributes: [
                                "ingredient"
                            ]
                        },

                        {
                            model: Instruction,
                            as: "instructions",

                            attributes: [
                                "instruction"
                            ]
                        }

                    ],

                    order: [
                        [
                            "id",
                            "DESC"
                        ]
                    ]

                });


            return res.json(
                recipes.map(
                    formatRecipe
                )
            );

        } catch (error) {

            console.error(
                "Get user recipes error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not retrieve user recipes."
            });

        }

    }
);


/*
=====================================================
GET ONE RECIPE
=====================================================
*/

router.get(
    "/:id",

    async function (req, res) {

        try {

            const recipeId =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(recipeId) ||
                recipeId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid recipe ID."
                });

            }


            const recipe =
                await Recipe.findByPk(
                    recipeId,
                    {
                        include: [

                            {
                                model: Ingredient,
                                as: "ingredients",

                                attributes: [
                                    "ingredient"
                                ],

                                order: [
                                    [
                                        "id",
                                        "ASC"
                                    ]
                                ]
                            },

                            {
                                model: Instruction,
                                as: "instructions",

                                attributes: [
                                    "instruction"
                                ],

                                order: [
                                    [
                                        "id",
                                        "ASC"
                                    ]
                                ]
                            }

                        ]
                    }
                );


            if (!recipe) {

                return res.status(404).json({
                    message:
                        "Recipe not found."
                });

            }


            return res.json(
                formatRecipe(recipe)
            );

        } catch (error) {

            console.error(
                "Get recipe error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not retrieve recipe."
            });

        }

    }
);


/*
=====================================================
CREATE RECIPE
=====================================================

USER ID COMES FROM JWT.

The client does NOT control user_id anymore.
=====================================================
*/

router.post(
    "/",

    authenticateToken,

    requireUser,

    upload.single("image"),

    async function (req, res) {

        let recipe = null;


        try {

            const validationError =
                validateRecipeData(
                    req.body
                );


            if (validationError) {

                if (req.file) {
                    deleteImageFile(
                        req.file.filename
                    );
                }


                return res.status(400).json({
                    message:
                        validationError
                });

            }


            const ingredientArray =
                cleanStringArray(
                    parseArray(
                        req.body.ingredients
                    )
                );


            const instructionArray =
                cleanStringArray(
                    parseArray(
                        req.body.instructions
                    )
                );


            if (
                ingredientArray.length === 0
            ) {

                if (req.file) {
                    deleteImageFile(
                        req.file.filename
                    );
                }


                return res.status(400).json({
                    message:
                        "At least one ingredient is required."
                });

            }


            if (
                instructionArray.length === 0
            ) {

                if (req.file) {
                    deleteImageFile(
                        req.file.filename
                    );
                }


                return res.status(400).json({
                    message:
                        "At least one instruction is required."
                });

            }


            /*
            -----------------------------------------
            CREATE RECIPE
            -----------------------------------------
            */

            recipe =
                await Recipe.create({

                    userId:
                        req.user.id,

                    title:
                        req.body.title.trim(),

                    description:
                        req.body.description.trim(),

                    category:
                        req.body.category
                            ? req.body.category.trim()
                            : "",

                    time:
                        req.body.time.trim(),

                    servings:
                        req.body.servings.trim(),

                    difficulty:
                        req.body.difficulty ||
                        "Easy",

                    image:
                        req.file
                            ? req.file.filename
                            : null,

                    calories:
                        Number(
                            req.body.calories
                        ) || 0,

                    protein:
                        Number(
                            req.body.protein
                        ) || 0,

                    carbs:
                        Number(
                            req.body.carbs
                        ) || 0,

                    fat:
                        Number(
                            req.body.fat
                        ) || 0

                });


            /*
            -----------------------------------------
            CREATE INGREDIENTS
            -----------------------------------------
            */

            await Ingredient.bulkCreate(

                ingredientArray.map(
                    function (ingredient) {

                        return {
                            recipeId:
                                recipe.id,

                            ingredient:
                                ingredient
                        };

                    }
                )

            );


            /*
            -----------------------------------------
            CREATE INSTRUCTIONS
            -----------------------------------------
            */

            await Instruction.bulkCreate(

                instructionArray.map(
                    function (instruction) {

                        return {
                            recipeId:
                                recipe.id,

                            instruction:
                                instruction
                        };

                    }
                )

            );


            /*
            -----------------------------------------
            RETURN CREATED RECIPE
            -----------------------------------------
            */

            const createdRecipe =
                await Recipe.findByPk(
                    recipe.id,
                    {
                        include: [

                            {
                                model: Ingredient,
                                as: "ingredients",

                                attributes: [
                                    "ingredient"
                                ]
                            },

                            {
                                model: Instruction,
                                as: "instructions",

                                attributes: [
                                    "instruction"
                                ]
                            }

                        ]
                    }
                );


            return res.status(201).json({

                message:
                    "Recipe created successfully.",

                recipe:
                    formatRecipe(
                        createdRecipe
                    )

            });

        } catch (error) {

            console.error(
                "Create recipe error:",
                error
            );


            if (
                req.file
            ) {

                deleteImageFile(
                    req.file.filename
                );

            }


            return res.status(500).json({
                message:
                    "Could not create recipe."
            });

        }

    }
);


/*
=====================================================
UPDATE RECIPE
=====================================================
*/

router.put(
    "/:id",

    authenticateToken,

    async function (req, res) {

        try {

            const recipeId =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(recipeId) ||
                recipeId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid recipe ID."
                });

            }


            const recipe =
                await Recipe.findByPk(
                    recipeId
                );


            if (!recipe) {

                return res.status(404).json({
                    message:
                        "Recipe not found."
                });

            }


            /*
            -----------------------------------------
            AUTHORIZATION
            -----------------------------------------
            */

            const isOwner =
                Number(recipe.userId) ===
                Number(req.user.id);


            const isAdmin =
                req.user.type ===
                "admin";


            if (
                !isOwner &&
                !isAdmin
            ) {

                return res.status(403).json({
                    message:
                        "You are not allowed to modify this recipe."
                });

            }


            const validationError =
                validateRecipeData(
                    req.body
                );


            if (validationError) {

                return res.status(400).json({
                    message:
                        validationError
                });

            }


            /*
            -----------------------------------------
            UPDATE BASIC RECIPE INFORMATION
            -----------------------------------------
            */

            recipe.title =
                req.body.title.trim();

            recipe.description =
                req.body.description.trim();

            recipe.category =
                req.body.category
                    ? req.body.category.trim()
                    : "";

            recipe.time =
                req.body.time.trim();

            recipe.servings =
                req.body.servings.trim();

            recipe.difficulty =
                req.body.difficulty ||
                "Easy";

            recipe.calories =
                Number(
                    req.body.calories
                ) || 0;

            recipe.protein =
                Number(
                    req.body.protein
                ) || 0;

            recipe.carbs =
                Number(
                    req.body.carbs
                ) || 0;

            recipe.fat =
                Number(
                    req.body.fat
                ) || 0;


            await recipe.save();


            /*
            -----------------------------------------
            UPDATE INGREDIENTS
            -----------------------------------------
            */

            if (
                req.body.ingredients !==
                undefined
            ) {

                const ingredientArray =
                    cleanStringArray(
                        parseArray(
                            req.body.ingredients
                        )
                    );


                if (
                    ingredientArray.length === 0
                ) {

                    return res.status(400).json({
                        message:
                            "At least one ingredient is required."
                    });

                }


                await Ingredient.destroy({
                    where: {
                        recipeId:
                            recipe.id
                    }
                });


                await Ingredient.bulkCreate(

                    ingredientArray.map(
                        function (ingredient) {

                            return {
                                recipeId:
                                    recipe.id,

                                ingredient:
                                    ingredient
                            };

                        }
                    )

                );

            }


            /*
            -----------------------------------------
            UPDATE INSTRUCTIONS
            -----------------------------------------
            */

            if (
                req.body.instructions !==
                undefined
            ) {

                const instructionArray =
                    cleanStringArray(
                        parseArray(
                            req.body.instructions
                        )
                    );


                if (
                    instructionArray.length === 0
                ) {

                    return res.status(400).json({
                        message:
                            "At least one instruction is required."
                    });

                }


                await Instruction.destroy({
                    where: {
                        recipeId:
                            recipe.id
                    }
                });


                await Instruction.bulkCreate(

                    instructionArray.map(
                        function (instruction) {

                            return {
                                recipeId:
                                    recipe.id,

                                instruction:
                                    instruction
                            };

                        }
                    )

                );

            }


            /*
            -----------------------------------------
            RETURN UPDATED RECIPE
            -----------------------------------------
            */

            const updatedRecipe =
                await Recipe.findByPk(
                    recipe.id,
                    {
                        include: [

                            {
                                model: Ingredient,
                                as: "ingredients",

                                attributes: [
                                    "ingredient"
                                ]
                            },

                            {
                                model: Instruction,
                                as: "instructions",

                                attributes: [
                                    "instruction"
                                ]
                            }

                        ]
                    }
                );


            return res.json({

                message:
                    "Recipe updated successfully.",

                recipe:
                    formatRecipe(
                        updatedRecipe
                    )

            });

        } catch (error) {

            console.error(
                "Update recipe error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not update recipe."
            });

        }

    }
);


/*
=====================================================
DELETE RECIPE
=====================================================
*/

router.delete(
    "/:id",

    authenticateToken,

    async function (req, res) {

        try {

            const recipeId =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(recipeId) ||
                recipeId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid recipe ID."
                });

            }


            const recipe =
                await Recipe.findByPk(
                    recipeId
                );


            if (!recipe) {

                return res.status(404).json({
                    message:
                        "Recipe not found."
                });

            }


            /*
            -----------------------------------------
            CHECK OWNER OR ADMIN
            -----------------------------------------
            */

            const isOwner =
                Number(recipe.userId) ===
                Number(req.user.id);


            const isAdmin =
                req.user.type ===
                "admin";


            if (
                !isOwner &&
                !isAdmin
            ) {

                return res.status(403).json({
                    message:
                        "You are not allowed to delete this recipe."
                });

            }


            const image =
                recipe.image;


            /*
            -----------------------------------------
            DELETE RELATED RECORDS
            -----------------------------------------
            */

            await Ingredient.destroy({
                where: {
                    recipeId:
                        recipe.id
                }
            });


            await Instruction.destroy({
                where: {
                    recipeId:
                        recipe.id
                }
            });


            /*
            Favourites are deleted because the
            recipe is being deleted.
            */

            const {
                Favourite
            } = require("../models");


            await Favourite.destroy({
                where: {
                    recipeId:
                        recipe.id
                }
            });


            /*
            -----------------------------------------
            DELETE RECIPE
            -----------------------------------------
            */

            await recipe.destroy();


            /*
            -----------------------------------------
            DELETE IMAGE
            -----------------------------------------
            */

            deleteImageFile(
                image
            );


            return res.json({
                message:
                    "Recipe deleted successfully."
            });

        } catch (error) {

            console.error(
                "Delete recipe error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not delete recipe."
            });

        }

    }
);


/*
=====================================================
MULTER ERROR HANDLER
=====================================================
*/

router.use(
    function (
        error,
        req,
        res,
        next
    ) {

        if (
            error instanceof
            multer.MulterError
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