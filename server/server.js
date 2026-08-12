const express = require("express");
const cors = require("cors");
const path = require("path");

const db =
    require("./database");

const authRoutes =
    require("./routes/auth");

const recipeRoutes =
    require("./routes/recipes");

const favouriteRoutes =
    require("./routes/favourites");

const userRoutes =
    require("./routes/users");


const app =
    express();


const PORT =
    3000;


// =====================================================
// Middleware
// =====================================================

app.use(
    cors()
);


app.use(
    express.json()
);


// =====================================================
// Serve Uploaded Images
// =====================================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// =====================================================
// Test Route
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.json({
            message:
                "Recipe App backend is running!"
        });
    }
);


// =====================================================
// Test Database
// =====================================================

app.get(
    "/api/test-db",
    (req, res) => {

        db.get(
            "SELECT 1 AS result",
            [],

            (err, row) => {

                if (err) {

                    return res.status(500).json({
                        error:
                            err.message
                    });
                }


                res.json({

                    message:
                        "SQLite is working!",

                    result:
                        row.result
                });
            }
        );
    }
);


// =====================================================
// API Routes
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/recipes",
    recipeRoutes
);


app.use(
    "/api/favourites",
    favouriteRoutes
);


app.use(
    "/api/users",
    userRoutes
);


// =====================================================
// 404
// =====================================================

app.use(
    function (req, res) {

        res.status(404).json({
            message:
                "API route not found."
        });
    }
);


// =====================================================
// General Error Handler
// =====================================================

app.use(
    function (
        error,
        req,
        res,
        next
    ) {

        console.error(
            "Server error:",
            error
        );


        res.status(500).json({
            message:
                "Internal server error."
        });
    }
);


// =====================================================
// Start Server
// =====================================================

app.listen(
    PORT,
    function () {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

        console.log(
            `Uploaded images available at http://localhost:${PORT}/uploads/`
        );
    }
);