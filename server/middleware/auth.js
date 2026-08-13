const jwt = require("jsonwebtoken");


// ====================================================
// AUTHENTICATE JWT TOKEN
// ====================================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token =
        authHeader &&
        authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;


    if (!token) {

        return res.status(401).json({
            message: "Authentication token is required."
        });

    }


    try {

        const user =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.user = user;

        next();

    } catch (error) {

        console.error(
            "JWT verification error:",
            error.message
        );


        return res.status(403).json({
            message: "Invalid or expired authentication token."
        });

    }

}


// ====================================================
// REQUIRE NORMAL USER
// ====================================================

function requireUser(req, res, next) {

    if (!req.user) {

        return res.status(401).json({
            message: "Authentication required."
        });

    }


    const userType =
        req.user.type ||
        req.user.role ||
        "user";


    if (userType === "admin") {

        return next();

    }


    next();

}


// ====================================================
// REQUIRE ADMIN
// ====================================================

function requireAdmin(req, res, next) {

    if (!req.user) {

        return res.status(401).json({
            message: "Authentication required."
        });

    }


    const userType =
        req.user.type ||
        req.user.role;


    if (userType !== "admin") {

        return res.status(403).json({
            message: "Admin access required."
        });

    }


    next();

}


// ====================================================
// EXPORT
// ====================================================

module.exports = {
    authenticateToken,
    requireUser,
    requireAdmin
};