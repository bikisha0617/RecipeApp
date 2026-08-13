const express = require("express");
const {Favourite,Recipe,Ingredient,Instruction} = require("../models");
const {authenticateToken,requireUser} = require("../middleware/auth");
const router = express.Router();

router.get("/",authenticateToken,requireUser,async function (req, res) {
    try {
        const favourites =await Favourite.findAll({where: 
            {
                userId:req.user.id
            },
            include: [
                {
                    model: Recipe,
                    as: "recipe",
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
            ],
            order: [["id","DESC"]]
        });
        const recipes =favourites.map(function (favourite) {
            const recipe =favourite.recipe;
            if (!recipe) {
                return null;
            }
            const result =recipe.toJSON();
            result.user_id =result.userId;
            delete result.userId;
            if (result.ingredients) {
                result.ingredients =result.ingredients.map(function (item) {
                    return item.ingredient;
                });
            }
            if (result.instructions) {
                result.instructions =result.instructions.map(function (item) {
                    return item.instruction;
                });
            }
            if (result.image && !result.image.startsWith("http")) {
                result.image ="http://localhost:3000/uploads/" +result.image;
            }
            return result;
        });
        return res.json(recipes.filter(Boolean));
    } catch (error) {
        console.error("Get favourites error:",error);
        return res.status(500).json({
            message:"Could not retrieve favourites."
        });
    }
});

router.post("/",authenticateToken,requireUser,async function (req, res) {
    try {
        const recipeId =Number(req.body.recipe_id);
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            return res.status(400).json({
                message:"Valid recipe ID is required."
            });
        }
        const recipe =await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                message:"Recipe not found."
            });
        }
        const existing =await Favourite.findOne({where: {
            userId:req.user.id,
            recipeId:recipeId
        }
    });
    if (existing) {
        return res.status(409).json({
            message:"Recipe is already in favourites."
        });
    }
    const favourite =await Favourite.create({
        userId:req.user.id,
        recipeId:recipeId
    });
    return res.status(201).json({
        message:"Recipe added to favourites.",
        favouriteId:favourite.id
    });
} catch (error) {
    console.error("Add favourite error:",error);
    return res.status(500).json({
        message:"Could not add favourite."
    });
}
});

router.delete("/:recipeId",authenticateToken,requireUser,async function (req, res) {
    try {
        const recipeId =Number(req.params.recipeId);
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            return res.status(400).json({
                message:"Invalid recipe ID."
            });
        }
        const deleted =await Favourite.destroy({where: {
            userId:req.user.id,
            recipeId:recipeId
        }
    });
    if (deleted === 0) {
        return res.status(404).json({
            message:"Favourite not found."
        });
    }
    return res.json({
        message:"Recipe removed from favourites."
     });
    } catch (error) {
        console.error("Remove favourite error:", error);
         return res.status(500).json({
            message:"Could not remove favourite."
        });
    }
});
module.exports = router;