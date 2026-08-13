const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Admin } = require("../models");
require("dotenv").config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createToken(payload) {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );
}

/*
====================================================
USER REGISTER
====================================================
*/

router.post("/register", async function (req, res) {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message:
                    "Name, email and password are required."
            });
        }

        const cleanName = name.trim();
        const cleanEmail =
            email.trim().toLowerCase();

        if (
            cleanName.length < 2 ||
            cleanName.length > 100
        ) {
            return res.status(400).json({
                message:
                    "Name must be between 2 and 100 characters."
            });
        }

        if (!validEmail(cleanEmail)) {
            return res.status(400).json({
                message:
                    "Please provide a valid email address."
            });
        }

        if (
            password.length < 6 ||
            password.length > 100
        ) {
            return res.status(400).json({
                message:
                    "Password must be between 6 and 100 characters."
            });
        }

        const existing =
            await User.findOne({
                where: {
                    email: cleanEmail
                }
            });

        if (existing) {
            return res.status(409).json({
                message:
                    "An account with this email already exists."
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        const user =
            await User.create({
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword
            });

        return res.status(201).json({
            message:
                "Account created successfully.",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            message:
                "Could not create account."
        });
    }
});

/*
====================================================
USER LOGIN
====================================================
*/

router.post("/login", async function (req, res) {
    try {
        const {
            email,
            password
        } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message:
                    "Email and password are required."
            });
        }

        const cleanEmail =
            email.trim().toLowerCase();

        const user =
            await User.findOne({
                where: {
                    email: cleanEmail
                }
            });

        if (
            !user ||
            !(await bcrypt.compare(
                password,
                user.password
            ))
        ) {
            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }

        const token =
            createToken({
                id: user.id,
                email: user.email,
                role: "user"
            });

        return res.json({
            message:
                "Login successful.",

            token,

            role: "user",

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
                "Could not log in."
        });
    }
});

/*
====================================================
ADMIN LOGIN
====================================================
*/

router.post(
    "/admin/login",
    async function (req, res) {
        try {
            const {
                username,
                password
            } = req.body;

            if (
                typeof username !== "string" ||
                typeof password !== "string"
            ) {
                return res.status(400).json({
                    message:
                        "Username and password are required."
                });
            }

            const admin =
                await Admin.findOne({
                    where: {
                        username:
                            username.trim()
                    }
                });

            if (
                !admin ||
                !(await bcrypt.compare(
                    password,
                    admin.password
                ))
            ) {
                return res.status(401).json({
                    message:
                        "Invalid username or password."
                });
            }

            const token =
                createToken({
                    id: admin.id,
                    username:
                        admin.username,
                    role: "admin"
                });

            return res.json({
                message:
                    "Admin login successful.",

                token,

                role: "admin",

                admin: {
                    id: admin.id,
                    username:
                        admin.username,
                    role: "admin"
                }
            });
        } catch (error) {
            console.error(
                "Admin login error:",
                error
            );

            return res.status(500).json({
                message:
                    "Could not log in as administrator."
            });
        }
    }
);

/*
====================================================
AUTH ME
====================================================
*/

router.get("/me", async function (req, res) {
    const header =
        req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
        return res.status(401).json({
            message:
                "Authentication required."
        });
    }

    try {
        const token =
            header.substring(7).trim();

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );

        if (decoded.role === "admin") {
            const admin =
                await Admin.findByPk(
                    decoded.id,
                    {
                        attributes: [
                            "id",
                            "username"
                        ]
                    }
                );

            if (!admin) {
                return res.status(401).json({
                    message:
                        "Admin account no longer exists."
                });
            }

            return res.json({
                authenticated: true,
                role: "admin",
                admin
            });
        }

        const user =
            await User.findByPk(
                decoded.id,
                {
                    attributes: [
                        "id",
                        "name",
                        "email"
                    ]
                }
            );

        if (!user) {
            return res.status(401).json({
                message:
                    "User account no longer exists."
            });
        }

        return res.json({
            authenticated: true,
            role: "user",
            user
        });
    } catch (error) {
        return res.status(401).json({
            message:
                "Invalid or expired token."
        });
    }
});

module.exports = router;