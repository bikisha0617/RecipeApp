const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}

function authenticateToken(req,res,next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message:"Authentication token is required."
        });
    }
    const token = authHeader.substring("Bearer ".length).trim();
    if (!token) {
        return res.status(401).json({
            message:"Authentication token is required."
        });
    }
    try {
        const decoded =jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        console.error("JWT verification error:",error.message);
        return res.status(403).json({
            message:"Invalid or expired authentication token."
        });
    }
}
function getUserRole(req) {
    if (!req.user) {
        return null;
    }
    return (req.user.role || req.user.type || null);
}
function requireUser(req,res,next) {
    if (!req.user) {
        return res.status(401).json({
            message:"Authentication required."
        });
    }
    const userRole = getUserRole(req);
    if (userRole !== "user") {
        return res.status(403).json({
            message:"Normal user access required."
        });
    }
    return next();
}
function requireAdmin(req,res,next) {
    if (!req.user) {
        return res.status(401).json({
            message:"Authentication required."
        });
    }
    const userRole =getUserRole(req);
    if (userRole !== "admin") {
        return res.status(403).json({
            message:"Admin access required."
        });
    }
    return next();
}
function requireAuthenticated(req,res,next) {
    if (!req.user) {
        return res.status(401).json({
            message:"Authentication required."
        });
    }
    const userRole =getUserRole(req);
    if (userRole !== "user" && userRole !== "admin") {
        return res.status(403).json({
            message:"Invalid authentication role."
        });
    }
    return next();
}
module.exports = {authenticateToken,requireUser,requireAdmin,requireAuthenticated};