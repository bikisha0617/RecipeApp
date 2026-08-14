const express = require("express");
const {User,Recipe,Favourite,Ingredient,Instruction} = require("../models");
const {authenticateToken,requireUser} = require("../middleware/auth");
const { sequelize } = require("../database");
const router = express.Router();

function validateUserData(data) {
    const {name,email} = data;
    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 2) {
            return "Name must be at least 2 characters.";
        }
        if (name.trim().length > 100) {
            return "Name cannot exceed 100 characters.";
        }
    }
    if (email !== undefined) {
        if (typeof email !== "string") {
            return "Invalid email address.";
        }
        const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            return "Please provide a valid email address.";
        }
    }
    return null;
}

router.get("/me",authenticateToken,requireUser,
    async function (req, res) {
        try {
            const user =await User.findByPk(req.user.id,
                {
                    attributes: ["id","name","email","notifications","darkMode"]
                }
            );
            if (!user) {
                return res.status(404).json({
                    message:"User not found."
                });
            }
            return res.json(user);
        } catch (error) {
            console.error("Get current user error:",error);
            return res.status(500).json({
                message:"Could not retrieve user."
            });
        }
    }
);

router.get("/:id",authenticateToken,requireUser,
    async function (req, res) {
        try {
            const requestedId =Number(req.params.id);
            if (!Number.isInteger(requestedId) ||requestedId <= 0) {
                return res.status(400).json({
                    message:"Invalid user ID."
                });
            }
            if (requestedId !==Number(req.user.id)) {
                return res.status(403).json({
                    message:"You can only access your own account."
                });
            }
            const user =await User.findByPk(requestedId,
                {
                    attributes: ["id","name","email","notifications","darkMode"]
                }
            );
            if (!user) {
                return res.status(404).json({
                    message:"User not found."
                });
            }
            return res.json(user);
        } catch (error) {
            console.error("Get user error:",error);
            return res.status(500).json({
                message:"Could not retrieve user."
            });
        }
    }
);

router.put("/:id",authenticateToken,requireUser,
    async function (req, res) {
        try {
            const userId =Number(req.params.id);
            if (!Number.isInteger(userId) || userId <= 0) {
                return res.status(400).json({
                    message:"Invalid user ID."
                });
            }
            if (userId !== Number(req.user.id)) {
                return res.status(403).json({
                    message:"You can only update your own account."
                });
            }
            const validationError =validateUserData(req.body);
            if (validationError) {
                return res.status(400).json({
                    message:validationError
                });
            }
            const user =await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    message:"User not found."
                });
            }
            if (req.body.name !== undefined) {
                user.name =req.body.name.trim();
            }
            if (req.body.email !== undefined) {
                user.email =req.body.email.trim().toLowerCase();
            }
            if (req.body.notifications !==undefined) {
                if (typeof req.body.notifications !=="boolean") {
                    return res.status(400).json({
                        message:"Notifications must be true or false."
                    });
                }
                user.notifications =req.body.notifications;
            }
            if (req.body.darkMode !==undefined) {
                if (typeof req.body.darkMode !=="boolean") {
                    return res.status(400).json({
                        message:"darkMode must be true or false."
                    });
                }
                user.darkMode =req.body.darkMode;
            }
            await user.save();
            return res.json({
                message:"Settings updated successfully.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    notifications:user.notifications,
                    darkMode:user.darkMode
                }
            });
        } catch (error) {
            console.error("Update user error:",error);
            if (error.name ==="SequelizeUniqueConstraintError") {
                return res.status(409).json({
                    message:"An account with this email already exists."
                });
            }
            return res.status(500).json({
                message:"Could not update user."
            });
        }
    }
);

router.delete("/:id",authenticateToken,requireUser,
    async function (req, res) {
        let transaction = null;
        try {
            const userId =Number(req.params.id);
            if (!Number.isInteger(userId) || userId <= 0) {
                return res.status(400).json({
                    message:"Invalid user ID."
                });
            }
            if (userId !== Number(req.user.id)) {
                return res.status(403).json({
                    message:"You can only delete your own account."
                });
            }
            const user =await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    message:"User not found."
                });
            }
            transaction =await sequelize.transaction();
            const recipes =
                await Recipe.findAll({
                    where: {userId: userId},
                    attributes: ["id"],
                    transaction
                });
            const recipeIds =recipes.map(function (recipe) {
                return recipe.id;
            });
            if (recipeIds.length > 0) {
                await Ingredient.destroy({
                    where: {recipeId: recipeIds},
                    transaction
                });
                await Instruction.destroy({
                    where: {recipeId: recipeIds},
                    transaction
                });
                await Favourite.destroy({
                    where: {recipeId: recipeIds},
                    transaction
                });
                await Recipe.destroy({
                    where: {id: recipeIds},
                    transaction
                });
            }
            await Favourite.destroy({
                where: {userId: userId},
                transaction
            });
            await user.destroy({
                transaction
            });
            await transaction.commit();
            transaction = null;
            return res.json({
                message:"Account deleted successfully."
            });
        } catch (error) {
            if (transaction) {
                try {
                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error("Account deletion rollback error:",rollbackError);
                }
            }
            console.error("Delete account error:",error);
            return res.status(500).json({
                message:"Could not delete account."
            });
        }
    }
);
module.exports = router;