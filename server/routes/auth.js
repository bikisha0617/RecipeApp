const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,Admin} = require("../models");
require("dotenv").config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}
function isValidEmail(email) {
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function createToken(payload) {
    return jwt.sign(payload,JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );
}
router.post("/register",async function (req, res) {
    try {
        const {name,email,password} = req.body;
            if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
                return res.status(400).json({
                    message:"Name, email and password are required."
                });
            }
            const cleanName =name.trim();
            const cleanEmail =email.trim().toLowerCase();
            if (cleanName.length < 2) {
                return res.status(400).json({
                    message:"Name must be at least 2 characters long."
                });
            }
            if (cleanName.length > 100) {
                return res.status(400).json({
                    message:"Name cannot exceed 100 characters."
                });
            }
            if (!isValidEmail(cleanEmail)) {
                return res.status(400).json({
                    message:"Please provide a valid email address."
                });
            }
            if (password.length < 6) {
                return res.status(400).json({
                    message:"Password must be at least 6 characters long."
                });
            }
            if (password.length > 100) {
                return res.status(400).json({
                    message:"Password cannot exceed 100 characters."
                });
            }
            const existingUser =await User.findOne({where: {email: cleanEmail}});
            if (existingUser) {
                return res.status(409).json({
                    message:"An account with this email already exists."
                });
            }
            const hashedPassword =await bcrypt.hash(password,12);
            const user =await User.create({
                    name: cleanName,
                    email: cleanEmail,
                    password:hashedPassword
                });
            return res.status(201).json({
                message:"Account created successfully.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error("Registration error:",error);
            return res.status(500).json({
                message:"Could not create account."
            });
        }
    }
);
router.post("/login",async function (req, res) {
    try {
        const {email,password} = req.body;
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message:"Email and password are required."
            });
        }
        const cleanEmail =email.trim().toLowerCase();
        if (!isValidEmail(cleanEmail)) {
            return res.status(400).json({
                message:"Please provide a valid email address."
            });
        }
        if (password.length === 0) {
            return res.status(400).json({
                message:"Password is required."
            });
        }
        const user =await User.findOne({where: {email: cleanEmail}});
        if (!user) {
            return res.status(401).json({
                message:"Invalid email or password."
            });
        }
        const passwordMatches =await bcrypt.compare(password,user.password);
        if (!passwordMatches) {
            return res.status(401).json({
                message:"Invalid email or password."
            });
        }
        const token =createToken({
            id: user.id,
            email: user.email,
            role: "user"
        });
        return res.json({
            message:"Login successful.",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:",error);
        return res.status(500).json({
            message:"Could not log in."
        });
    }
});
router.post("/admin/login",async function (req, res) {
    try {
        const {username,password} = req.body;
        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message:"Username and password are required."
            });
        }
        const cleanUsername =username.trim();
        if (cleanUsername.length < 3) {
            return res.status(400).json({
                message:"Username must be at least 3 characters long."
            });
        }
        if (password.length === 0) {
            return res.status(400).json({
                message:"Password is required."
            });
        }
        const admin =await Admin.findOne({where: {username:cleanUsername}});
        if (!admin) {
            return res.status(401).json({
                message:"Invalid username or password."
            });
        }
        const passwordMatches =await bcrypt.compare(password,admin.password);
        if (!passwordMatches) {
            return res.status(401).json({
                message:"Invalid username or password."
            });
        }
        const token =createToken({
            id: admin.id,
            username:admin.username,
            role: "admin"
        });
        return res.json({
            message:"Admin login successful.",
            token: token,
            admin: {
                id: admin.id,
                username:admin.username,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Admin login error:",error);
        return res.status(500).json({
            message:"Could not log in as administrator."
        });
    }
});
router.get("/me",async function (req, res) {
    const authHeader =req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message:"Authentication required."
        });
    }
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message:"Invalid authorization format."
        });
    }
    const token =authHeader.split(" ")[1];
    try {
        const decoded =jwt.verify(token,JWT_SECRET);
        if (decoded.role === "admin") {
            const admin =await Admin.findByPk(decoded.id);
            if (!admin) {
                return res.status(401).json({
                    message:"Admin account no longer exists."
                });
            }
            return res.json({
                    authenticated: true,
                    role: "admin",
                    admin: {
                        id: admin.id,
                        username:admin.username
                    }
                });
            }
            const user =await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({
                    message:"User account no longer exists."
                });
            }
            return res.json({
                authenticated: true,
                role: "user",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            return res.status(401).json({
                message:"Invalid or expired token."
            });
        }
    }
);
module.exports = router;