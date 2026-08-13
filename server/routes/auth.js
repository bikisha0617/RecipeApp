const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
    User
} = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";


/*
=====================================================
VALIDATION FUNCTIONS
=====================================================
*/

function validateName(name) {

    if (!name || typeof name !== "string") {
        return "Name is required.";
    }

    const cleanName = name.trim();

    if (cleanName.length < 2) {
        return "Name must be at least 2 characters long.";
    }

    if (cleanName.length > 100) {
        return "Name cannot exceed 100 characters.";
    }

    return null;
}


function validateEmail(email) {

    if (!email || typeof email !== "string") {
        return "Email is required.";
    }

    const cleanEmail = email.trim().toLowerCase();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
        return "Please provide a valid email address.";
    }

    return null;
}


function validatePassword(password) {

    if (!password || typeof password !== "string") {
        return "Password is required.";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }

    if (password.length > 100) {
        return "Password cannot exceed 100 characters.";
    }

    return null;
}


/*
=====================================================
CREATE USER JWT
=====================================================
*/

function createUserToken(user) {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            type: "user"
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
}


/*
=====================================================
REGISTER
=====================================================
*/

router.post("/register", async function (req, res) {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        /*
        ---------------------------------------------
        VALIDATION
        ---------------------------------------------
        */

        const nameError =
            validateName(name);

        if (nameError) {
            return res.status(400).json({
                message: nameError
            });
        }


        const emailError =
            validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                message: emailError
            });
        }


        const passwordError =
            validatePassword(password);

        if (passwordError) {
            return res.status(400).json({
                message: passwordError
            });
        }


        const cleanName =
            name.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        /*
        ---------------------------------------------
        CHECK EXISTING USER
        ---------------------------------------------
        */

        const existingUser =
            await User.findOne({
                where: {
                    email: cleanEmail
                }
            });


        if (existingUser) {
            return res.status(409).json({
                message:
                    "An account with this email already exists."
            });
        }


        /*
        ---------------------------------------------
        HASH PASSWORD
        ---------------------------------------------
        */

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        /*
        ---------------------------------------------
        CREATE USER
        ---------------------------------------------
        */

        const user =
            await User.create({
                name: cleanName,
                email: cleanEmail,
                password: passwordHash
            });


        /*
        ---------------------------------------------
        RESPONSE
        ---------------------------------------------
        */

        return res.status(201).json({

            message:
                "Account created successfully.",

            userId:
                user.id

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        /*
        Sequelize validation error
        */

        if (
            error.name ===
            "SequelizeValidationError"
        ) {

            return res.status(400).json({
                message:
                    error.errors
                        .map(function (item) {
                            return item.message;
                        })
                        .join(" ")
            });
        }


        /*
        Duplicate email
        */

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
                "Could not create account."
        });
    }
});


/*
=====================================================
LOGIN
=====================================================
*/

router.post("/login", async function (req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        /*
        ---------------------------------------------
        VALIDATION
        ---------------------------------------------
        */

        const emailError =
            validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                message: emailError
            });
        }


        const passwordError =
            validatePassword(password);

        if (passwordError) {
            return res.status(400).json({
                message: passwordError
            });
        }


        const cleanEmail =
            email.trim().toLowerCase();


        /*
        ---------------------------------------------
        FIND USER
        ---------------------------------------------
        */

        const user =
            await User.findOne({
                where: {
                    email: cleanEmail
                }
            });


        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }


        /*
        ---------------------------------------------
        COMPARE PASSWORD
        ---------------------------------------------
        */

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatches) {
            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }


        /*
        ---------------------------------------------
        CREATE JWT
        ---------------------------------------------
        */

        const token =
            createUserToken(user);


        /*
        ---------------------------------------------
        RESPONSE
        ---------------------------------------------
        */

        return res.json({

            message:
                "Login successful.",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message:
                "Could not login."
        });
    }
});


module.exports = router;