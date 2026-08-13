const express = require("express");

const {
    User
} = require("../models");

const {
    authenticateToken,
    requireUser
} = require("../middleware/auth");


const router = express.Router();


/*
=====================================================
VALIDATE USER DATA
=====================================================
*/

function validateUserData(
    data
) {

    const {
        name,
        email
    } = data;


    if (
        name !== undefined
    ) {

        if (
            typeof name !== "string" ||
            name.trim().length < 2
        ) {

            return "Name must be at least 2 characters.";

        }


        if (
            name.trim().length > 100
        ) {

            return "Name cannot exceed 100 characters.";

        }

    }


    if (
        email !== undefined
    ) {

        if (
            typeof email !== "string"
        ) {

            return "Invalid email address.";

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                email.trim()
            )
        ) {

            return "Please provide a valid email address.";

        }

    }


    return null;

}


/*
=====================================================
GET CURRENT USER
=====================================================

The client can simply request:

GET /api/users/me
=====================================================
*/

router.get(
    "/me",

    authenticateToken,

    requireUser,

    async function (req, res) {

        try {

            const user =
                await User.findByPk(
                    req.user.id,
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
                "Get current user error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not retrieve user."
            });

        }

    }
);


/*
=====================================================
GET USER BY ID
=====================================================
*/

router.get(
    "/:id",

    authenticateToken,

    requireUser,

    async function (req, res) {

        try {

            const requestedId =
                Number(
                    req.params.id
                );


            if (
                requestedId !==
                Number(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You can only access your own account."
                });

            }


            const user =
                await User.findByPk(
                    requestedId,
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
                "Get user error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not retrieve user."
            });

        }

    }
);


/*
=====================================================
UPDATE USER
=====================================================
*/

router.put(
    "/:id",

    authenticateToken,

    requireUser,

    async function (req, res) {

        try {

            const userId =
                Number(
                    req.params.id
                );


            /*
            -----------------------------------------
            AUTHORIZATION
            -----------------------------------------
            */

            if (
                userId !==
                Number(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You can only update your own account."
                });

            }


            const validationError =
                validateUserData(
                    req.body
                );


            if (validationError) {

                return res.status(400).json({
                    message:
                        validationError
                });

            }


            const user =
                await User.findByPk(
                    userId
                );


            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found."
                });

            }


            /*
            -----------------------------------------
            UPDATE NAME
            -----------------------------------------
            */

            if (
                req.body.name !==
                undefined
            ) {

                user.name =
                    req.body.name.trim();

            }


            /*
            -----------------------------------------
            UPDATE EMAIL
            -----------------------------------------
            */

            if (
                req.body.email !==
                undefined
            ) {

                user.email =
                    req.body.email
                        .trim()
                        .toLowerCase();

            }


            /*
            -----------------------------------------
            UPDATE NOTIFICATIONS
            -----------------------------------------
            */

            if (
                req.body.notifications !==
                undefined
            ) {

                user.notifications =
                    Boolean(
                        req.body.notifications
                    );

            }


            /*
            -----------------------------------------
            UPDATE DARK MODE
            -----------------------------------------
            */

            if (
                req.body.darkMode !==
                undefined
            ) {

                user.darkMode =
                    Boolean(
                        req.body.darkMode
                    );

            }


            await user.save();


            return res.json({

                message:
                    "Settings updated successfully.",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    notifications:
                        user.notifications,
                    darkMode:
                        user.darkMode
                }

            });

        } catch (error) {

            console.error(
                "Update user error:",
                error
            );


            if (
                error.name ===
                "SequelizeUniqueConstraintError"
            ) {

                return res.status(409).json({
                    message:
                        "An account with this email already exists."
                });

            }


            return res.status(500).json({
                message:
                    "Could not update user."
            });

        }

    }
);


/*
=====================================================
DELETE USER ACCOUNT
=====================================================
*/

router.delete(
    "/:id",

    authenticateToken,

    requireUser,

    async function (req, res) {

        try {

            const userId =
                Number(
                    req.params.id
                );


            if (
                userId !==
                Number(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You can only delete your own account."
                });

            }


            const user =
                await User.findByPk(
                    userId
                );


            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found."
                });

            }


            await user.destroy();


            return res.json({
                message:
                    "Account deleted successfully."
            });

        } catch (error) {

            console.error(
                "Delete account error:",
                error
            );


            return res.status(500).json({
                message:
                    "Could not delete account."
            });

        }

    }
);


module.exports = router;