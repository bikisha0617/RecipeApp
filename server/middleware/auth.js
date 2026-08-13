const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


/*
=====================================================
VERIFY JWT SECRET
=====================================================
*/

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET is missing. Please add JWT_SECRET to the .env file."
    );
}


/*
=====================================================
AUTHENTICATE USER
=====================================================

This middleware checks:

Authorization: Bearer <token>

If the token is valid, the decoded user information
is stored in:

req.user
*/

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const parts = authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        return res.status(401).json({
            message: "Invalid authorization header."
        });
    }

    const token = parts[1];

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "JWT verification error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
}


/*
=====================================================
REQUIRE NORMAL USER
=====================================================

This prevents an admin token from being used as a
normal user token when a route specifically requires
a user.
*/

function requireUser(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    if (req.user.type !== "user") {
        return res.status(403).json({
            message: "User access required."
        });
    }

    next();
}


/*
=====================================================
REQUIRE ADMIN
=====================================================

This protects administrative functionality.
*/

function requireAdmin(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    if (req.user.type !== "admin") {
        return res.status(403).json({
            message: "Administrator access required."
        });
    }

    next();
}


module.exports = {
    authenticateToken,
    requireUser,
    requireAdmin
};