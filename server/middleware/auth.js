const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}
function authenticateToken(req, res, next) {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication token is required."
        });
    }
    const token = header.substring(7).trim();
    if (!token) {
        return res.status(401).json({
            message: "Authentication token is required."
        });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        return next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
}
function requireUser(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }
    if (req.user.role !== "user") {
        return res.status(403).json({
            message: "Normal user access required."
        });
    }
    return next();
}
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required."
        });
    }
    return next();
}
function requireAuthenticated(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }
    if (req.user.role !== "user" && req.user.role !== "admin") {
        return res.status(403).json({
            message: "Invalid authentication role."
        });
    }
    return next();
}
module.exports = {authenticateToken,requireUser,requireAdmin,requireAuthenticated};