const express = require("express");

const {
    User,
    Admin,
    Recipe,
    Ingredient,
    Instruction,
    Favourite
} = require("../models");

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/auth");

const { sequelize } = require("../database");

const router = express.Router();


// ======================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// ======================================================

router.get(
    "/dashboard",
    authenticateToken,
    requireAdmin,
    async function (req, res) {

        try {

            const userCount =
                await User.count();

            const recipeCount =
                await Recipe.count();

            const favouriteCount =
                await Favourite.count();

            const adminCount =
                await Admin.count();


            return res.json({
                users: userCount,
                recipes: recipeCount,
                favourites: favouriteCount,
                admins: adminCount
            });

        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            return res.status(500).json({
                message:
                    "Could not retrieve dashboard data."
            });
        }
    }
);


// ======================================================
// GET ALL USERS
// GET /api/admin/users
// ======================================================

router.get(
    "/users",
    authenticateToken,
    requireAdmin,
    async function (req, res) {

        try {

            const users =
                await User.findAll({
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "notifications",
                        "darkMode"
                    ],

                    order: [
                        ["id", "DESC"]
                    ]
                });


            return res.json(users);

        } catch (error) {

            console.error(
                "Admin get users error:",
                error
            );

            return res.status(500).json({
                message:
                    "Could not retrieve users."
            });
        }
    }
);


// ======================================================
// GET ALL RECIPES
// GET /api/admin/recipes
// ======================================================

router.get(
    "/recipes",
    authenticateToken,
    requireAdmin,
    async function (req, res) {

        try {

            const recipes =
                await Recipe.findAll({
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email"
                            ]
                        }
                    ],

                    order: [
                        ["id", "DESC"]
                    ]
                });


            const result =
                recipes.map(function (recipe) {

                    const item =
                        recipe.toJSON();


                    item.user_id =
                        item.userId;

                    delete item.userId;


                    if (item.user) {

                        item.author =
                            item.user.name;

                        delete item.user;
                    } else {

                        item.author =
                            "Recipe App";
                    }


                    if (
                        item.image &&
                        !item.image.startsWith(
                            "http://"
                        ) &&
                        !item.image.startsWith(
                            "https://"
                        )
                    ) {

                        item.image =
                            "http://localhost:3000/uploads/" +
                            item.image;
                    }


                    return item;
                });


            return res.json(result);

        } catch (error) {

            console.error(
                "Admin get recipes error:",
                error
            );

            return res.status(500).json({
                message:
                    "Could not retrieve recipes."
            });
        }
    }
);


// ======================================================
// GET ONE USER
// GET /api/admin/users/:id
// ======================================================

router.get(
    "/users/:id",
    authenticateToken,
    requireAdmin,
    async function (req, res) {

        try {

            const userId =
                Number(req.params.id);


            if (
                !Number.isInteger(userId) ||
                userId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Invalid user ID."
                });
            }


            const user =
                await User.findByPk(
                    userId,
                    {
                        attributes: [
                            "id",
                            "name",
                            "email",
                            "notifications",
                            "darkMode"
                        ]
                    }
                );


            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found."
                });
            }


            return res.json(user);

        } catch (error) {

            console.error(
                "Admin get user error:",
                error
            );

            return res.status(500).json({
                message:
                    "Could not retrieve user."
            });
        }
    }
);


// ======================================================
// DELETE RECIPE AS ADMIN
// DELETE /api/admin/recipes/:id
// ======================================================

router.delete(
    "/recipes/:id",
    authenticateToken,
    requireAdmin,
    async function (req, res) {

        let transaction = null;


        try {

            const recipeId =
                Number(req.params.id);


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
                await Recipe.findByPk(recipeId);


            if (!recipe) {
                return res.status(404).json({
                    message:
                        "Recipe not found."
                });
            }


            transaction =
                await sequelize.transaction();


            await Ingredient.destroy({
                where: {
                    recipeId: recipeId
                },

                transaction
            });


            await Instruction.destroy({
                where: {
                    recipeId: recipeId
                },

                transaction
            });


            await Favourite.destroy({
                where: {
                    recipeId: recipeId
                },

                transaction
            });


            await recipe.destroy({
                transaction
            });


            await transaction.commit();

            transaction = null;


            return res.json({
                message:
                    "Recipe deleted successfully."
            });

        } catch (error) {

            if (transaction) {
                try {
                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error(
                        "Admin recipe rollback error:",
                        rollbackError
                    );
                }
            }


            console.error(
                "Admin delete recipe error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not delete recipe."
            });
        }
    }
);


// ======================================================
// DELETE USER AS ADMIN
// DELETE /api/admin/users/:id
// ======================================================

router.delete(
    "/users/:id",
    authenticateToken,
    requireAdmin,
    async function (req, res) {

        let transaction = null;


        try {

            const userId =
                Number(req.params.id);


            if (
                !Number.isInteger(userId) ||
                userId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Invalid user ID."
                });
            }


            const user =
                await User.findByPk(userId);


            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found."
                });
            }


            transaction =
                await sequelize.transaction();


            const recipes =
                await Recipe.findAll({
                    where: {
                        userId: userId
                    },

                    attributes: [
                        "id"
                    ],

                    transaction
                });


            const recipeIds =
                recipes.map(function (recipe) {
                    return recipe.id;
                });


            if (recipeIds.length > 0) {

                await Ingredient.destroy({
                    where: {
                        recipeId: recipeIds
                    },

                    transaction
                });


                await Instruction.destroy({
                    where: {
                        recipeId: recipeIds
                    },

                    transaction
                });


                await Favourite.destroy({
                    where: {
                        recipeId: recipeIds
                    },

                    transaction
                });


                await Recipe.destroy({
                    where: {
                        id: recipeIds
                    },

                    transaction
                });
            }


            await Favourite.destroy({
                where: {
                    userId: userId
                },

                transaction
            });


            await user.destroy({
                transaction
            });


            await transaction.commit();

            transaction = null;


            return res.json({
                message:
                    "User deleted successfully."
            });

        } catch (error) {

            if (transaction) {
                try {
                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error(
                        "Admin user rollback error:",
                        rollbackError
                    );
                }
            }


            console.error(
                "Admin delete user error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not delete user."
            });
        }
    }
);


module.exports = router;