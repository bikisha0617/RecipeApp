const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {Recipe,Ingredient,Instruction,Favourite,User} = require("../models");
const {authenticateToken,requireUser,requireAdmin} = require("../middleware/auth");
const {sequelize} = require("../database");
const router =express.Router();
const uploadDir =path.join(__dirname,"..","uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir,{
        recursive: true
    });
}
const imageDir =path.join(__dirname,"..","images");
const storage =multer.diskStorage({
    destination:function (req,file,callback) {
        callback(null,uploadDir);
    },
    filename:function (req,file,callback) {
        const extension =path.extname(file.originalname).toLowerCase();
        const filename =Date.now() +"-" +Math.round(Math.random() *1E9) +extension;
        callback(null,filename);
    }
});
const upload =multer({
    storage:storage,
    fileFilter:function (req,file,callback) {
        const allowedTypes = ["image/jpeg","image/jpg","image/png","image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null,true);
        } else {
            callback(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
        }
    },
    limits: {
        fileSize:5 * 1024 * 1024
    }
});

function getImageUrl(image) {
    if (!image) {
        return null;
    }
    const cleanImage =String(image).trim();
    if (!cleanImage) {
        return null;
    }
    if (cleanImage.startsWith("http://") || cleanImage.startsWith("https://")) {
        return cleanImage;
    }
    if (!cleanImage.includes("/")) {
        return (`http://localhost:3000/uploads/${encodeURIComponent(cleanImage)}`);
    }
    if (cleanImage.startsWith("uploads/")) {
        return (`http://localhost:3000/${cleanImage}`);
    }
    if (cleanImage.startsWith("/uploads/")) {
        return (`http://localhost:3000${cleanImage}`);
    }
    if (cleanImage.startsWith("images/")) {
        return (`http://localhost:3000/${cleanImage}`);
    }
    if (cleanImage.startsWith("/images/")) {
        return (`http://localhost:3000${cleanImage}`);
    }
    return (`http://localhost:3000/uploads/${encodeURIComponent(path.basename(cleanImage))}`);
}

function deleteImageFile(image) {
    if (!image) {
        return;
    }
    const cleanImage =String(image).trim();
    const filename =path.basename(cleanImage);
    if (!filename || filename === "." || filename === "..") {
        return;
    }
    const imagePath =path.join(uploadDir,filename);
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath,function (error) {
            if (error) {
                console.error("Could not delete image:",error.message);
            }
        });
    }
}

function validateRecipeData(data) {
    const {title,description,time,servings,difficulty} = data;
    if (typeof title !== "string" || title.trim().length < 2) {
        return ("Recipe title must be at least 2 characters.");
    }
    if (title.trim().length > 150) {
        return ("Recipe title cannot exceed 150 characters.");
    }
    if (typeof description !== "string" || description.trim().length < 5) {
        return ("Recipe description must be at least 5 characters.");
    }
    if (typeof time !== "string" || time.trim() === "") {
        return ("Cooking time is required.");
    }
    if (typeof servings !== "string" || servings.trim() === "") {
        return ("Servings are required.");
    }
    if (difficulty !== undefined && difficulty !== "" && !["Easy","Medium","Hard"].includes(difficulty)) {
        return ("Difficulty must be Easy, Medium or Hard.");
    }
    return null;
}
function parseArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value !== "string" || value.trim() === "") {
        return [];
    }
    try {
        const parsed =JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function cleanStringArray(values) {
    if (!Array.isArray(values)) {
        return [];
    }
    return values.filter(function (value) {
        return (typeof value === "string" && value.trim() !== "");
    }).map(function (value) {
        return value.trim();
    });
}
function formatRecipe(recipe) {
    if (!recipe) {
        return null;
    }
    const plainRecipe =recipe.toJSON();
    plainRecipe.user_id =plainRecipe.userId;
    delete plainRecipe.userId;
    plainRecipe.image =getImageUrl(plainRecipe.image
    );

    if (plainRecipe.user) {
        plainRecipe.author =plainRecipe.user.name;
        delete plainRecipe.user;
    } else {
        plainRecipe.author ="Recipe App";
    }
    if (Array.isArray(plainRecipe.ingredients)) {
        plainRecipe.ingredients =plainRecipe.ingredients.map(
            function (item) {
                return item.ingredient;
            });
    } else {
        plainRecipe.ingredients =[];
    }

    if (Array.isArray(plainRecipe.instructions)) {
        plainRecipe.instructions =plainRecipe.instructions.map(function (item) {
            return item.instruction;
        });
    } else {
        plainRecipe.instructions =[];
    }
    return plainRecipe;
}

function recipeIncludes() {
    return [
        {
            model: User,
            as: "user",
            attributes: [
                "id",
                "name"
            ]
        },
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
    ];
}

router.get("/",async function (req,res) {
    try {
        const recipes =await Recipe.findAll({
            include: recipeIncludes(),
            order: [["id", "DESC"]]
        });
        return res.json(recipes.map(formatRecipe));
    } catch (error) {
        console.error("Get all recipes error:",error);
        return res.status(500).json({
            message:"Could not retrieve recipes."
        });
    }
});

router.get("/user/:userId",authenticateToken,requireUser,async function (req,res) {
    try {
        const requestedUserId =Number(req.params.userId);
        if (!Number.isInteger(requestedUserId) || requestedUserId <= 0) {
            return res.status(400).json({message:"Invalid user ID."});
        }
        if (requestedUserId !== Number(req.user.id)) {
            return res.status(403).json({
                message:"You can only access your own recipes."
            });
        }
        const recipes =await Recipe.findAll({where: {
            userId:req.user.id
        },
        include:recipeIncludes(),
        order: [["id","DESC"]]
    });
    return res.json(recipes.map(formatRecipe));
} catch (error) {
    console.error("Get user recipes error:",error);
    return res.status(500).json({
        message:"Could not retrieve user recipes."
    });
}
});

router.get("/:id",async function (req,res) {
    try {
        const recipeId =Number(req.params.id);
        if (!Number.isInteger(recipeId) ||recipeId <= 0) {
            return res.status(400).json({
                message:"Invalid recipe ID."
            });
        }
        const recipe =await Recipe.findByPk(recipeId,
            {
                include:recipeIncludes()
            }
        );
        if (!recipe) {
            return res.status(404).json({
                message:"Recipe not found."
            });
        }
        return res.json(formatRecipe(recipe));
    } catch (error) {
        console.error("Get recipe error:",error);
        return res.status(500).json({
            message:"Could not retrieve recipe."
        });
    }
});

router.post("/",authenticateToken,requireUser,upload.single("image"),async function (req,res) {
    let transaction = null;
    try {
        const validationError =validateRecipeData(req.body);
        if (validationError) {
            if (req.file) {
                deleteImageFile(req.file.filename);
            }
            return res.status(400).json({
                message:validationError
            });
        }
        const ingredientArray =cleanStringArray(parseArray(req.body.ingredients));
        const instructionArray =cleanStringArray(parseArray(req.body.instructions));
        if (ingredientArray.length === 0) {
            if (req.file) {
                deleteImageFile(req.file.filename);
            }
            return res.status(400).json({
                message:"At least one ingredient is required."
            });
        }
        if (instructionArray.length === 0) {
            if (req.file) {deleteImageFile(req.file.filename);}
                return res.status(400).json({
                    message:"At least one instruction is required."
                });
            }
            transaction =await sequelize.transaction();
            const recipe =await Recipe.create({
                userId:req.user.id,
                title:req.body.title.trim(),
                description:req.body.description.trim(),
                category:typeof req.body.category ==="string" ? req.body.category.trim() : "",
                time:req.body.time.trim(),
                servings:req.body.servings.trim(),
                difficulty:req.body.difficulty ||"Easy",
                image:req.file ? req.file.filename : null,
                calories:Math.max(0,Number(req.body.calories) || 0),
                protein:Math.max(0,Number(req.body.protein) || 0),
                carbs:Math.max(0,Number(req.body.carbs) || 0),
                fat:Math.max(0,Number(req.body.fat) || 0)
            }, {transaction});
            await Ingredient.bulkCreate(ingredientArray.map(function (ingredient) {
                return {
                    recipeId: recipe.id,
                    ingredient: ingredient
                };
            }
        ),{transaction});
        await Instruction.bulkCreate(instructionArray.map(function (instruction) {
            return {
                recipeId:recipe.id,
                instruction:instruction
            };
        }),{transaction});
        await transaction.commit();
        transaction = null;
        const createdRecipe =await Recipe.findByPk(recipe.id,
            {
                include:recipeIncludes()
            }
        );
        return res.status(201).json({
            message:"Recipe created successfully.",
            recipe:formatRecipe(createdRecipe)
        });
    } catch (error) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error("Transaction rollback error:",rollbackError);
            }
        }
        console.error("Create recipe error:",error);
        if (req.file) {
            deleteImageFile(req.file.filename);
        }
        return res.status(500).json({
            message:"Could not create recipe."
        });
    }
});

router.put("/:id",authenticateToken,async function (req,res) {
    let transaction = null;
    try {
        const recipeId =Number(req.params.id);
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            return res.status(400).json({
                message:"Invalid recipe ID."
            });
        }
        const recipe =await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                message:"Recipe not found."
            });
        }
        const userRole =req.user.role ||req.user.type;
        const isOwner =Number(recipe.userId) ===Number(req.user.id);
        const isAdmin =userRole === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message:"You are not allowed to modify this recipe."
            });
        }
        const validationError =validateRecipeData(req.body);
        if (validationError) {
            return res.status(400).json({
                message:validationError
            });
        }
        const ingredientArray =req.body.ingredients !==undefined ? cleanStringArray(parseArray(req.body.ingredients)) : null;
        const instructionArray =req.body.instructions !==undefined? cleanStringArray(parseArray(req.body.instructions)): null;
        if (ingredientArray && ingredientArray.length === 0) {
            return res.status(400).json({
                message:"At least one ingredient is required."
            });
        }
        if (instructionArray && instructionArray.length === 0) {
            return res.status(400).json({
                message:"At least one instruction is required."
            });
        }
        transaction =await sequelize.transaction();
        recipe.title =req.body.title.trim();
        recipe.description =req.body.description.trim();
        recipe.category =typeof req.body.category ==="string" ? req.body.category.trim() : "";
        recipe.time = req.body.time.trim();
        recipe.servings = req.body.servings.trim();
        recipe.difficulty =req.body.difficulty ||"Easy";
        recipe.calories =Math.max(0,Number(req.body.calories) || 0);
        recipe.protein =Math.max(0,Number(req.body.protein) || 0);
        recipe.carbs =Math.max(0,Number(req.body.carbs) || 0);
        recipe.fat =Math.max(0,Number(req.body.fat) || 0);
        await recipe.save({transaction});
        if (ingredientArray) {
            await Ingredient.destroy({where: {
                recipeId:recipe.id
            },transaction
            });
            await Ingredient.bulkCreate(ingredientArray.map(function (ingredient) {
                return {recipeId:recipe.id,ingredient:ingredient};
            }),{transaction}
            );
        }
        if (instructionArray) {
            await Instruction.destroy({where: {
                recipeId:recipe.id
            },transaction
            });
            await Instruction.bulkCreate(instructionArray.map(function (instruction) {
                return {recipeId:recipe.id,instruction:instruction};
            }),{transaction});
        }
        await transaction.commit();
        transaction = null;
        const updatedRecipe =await Recipe.findByPk(recipe.id,
            {
                include:recipeIncludes()
            });
            return res.json({
                    message:"Recipe updated successfully.",
                    recipe:formatRecipe(updatedRecipe)
                });
    } catch (error) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error("Transaction rollback error:",rollbackError);
            }
        }
        console.error("Update recipe error:",error``);
        return res.status(500).json({
            message:"Could not update recipe."
        });
    }
});

router.delete("/:id",authenticateToken,async function (req,res) {
    try {
        const recipeId =Number(req.params.id);
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            return res.status(400).json({
                message:"Invalid recipe ID."
            });
        }
        const recipe =await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                message:"Recipe not found."
            });
        }
        const userRole =req.user.role || req.user.type;
        const isOwner =Number(recipe.userId) ===Number(req.user.id);
        const isAdmin =userRole === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message:"You are not allowed to delete this recipe."
            });
        }
        const image =recipe.image;
        const transaction =await sequelize.transaction();
        try {
            await Ingredient.destroy({where: {
                recipeId:recipe.id
            },transaction
            });
            await Instruction.destroy({where: {
                recipeId:recipe.id
            },transaction
            });
            await Favourite.destroy({where: {
                recipeId:recipe.id
            },transaction
            });
            await recipe.destroy({
                transaction
            });
            await transaction.commit();
        } catch (transactionError) {
            await transaction.rollback();
            throw transactionError;
        }
        deleteImageFile(image);
        return res.json({
            message:"Recipe deleted successfully."});
        } catch (error) {
            console.error("Delete recipe error:",error);
            return res.status(500).json({
                message:"Could not delete recipe."
            });
        }
    });

router.use(function (error,req,res,next) {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            message:error.message
        });
    }
    if (error) {
        console.error("Recipe upload error:",error);
        return res.status(400).json({
            message:error.message || "Image upload failed."
        });
    }
    return next();
});
module.exports = router;