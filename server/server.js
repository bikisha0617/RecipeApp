require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const {
    sequelize
} = require("./models");


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
    process.env.PORT || 3000;


/*
=====================================================
MIDDLEWARE
=====================================================
*/

app.use(
    cors({
        origin: true,
        credentials: true
    })
);


app.use(
    express.json()
);


app.use(
    express.urlencoded({
        extended: true
    })
);


/*
=====================================================
STATIC UPLOADS
=====================================================
*/

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


/*
=====================================================
HOME
=====================================================
*/

app.get(
    "/",
    function (req, res) {

        res.json({
            message:
                "Recipe App backend is running!"
        });

    }
);


/*
=====================================================
DATABASE TEST
=====================================================
*/

app.get(
    "/api/test-db",
    async function (req, res) {

        try {

            await sequelize.authenticate();


            res.json({
                message:
                    "SQLite + Sequelize is working!"
            });

        } catch (error) {

            console.error(
                "Database test error:",
                error
            );


            res.status(500).json({
                message:
                    "Database connection failed."
            });

        }

    }
);


/*
=====================================================
API ROUTES
=====================================================
*/

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


/*
=====================================================
404
=====================================================
*/

app.use(
    function (req, res) {

        res.status(404).json({
            message:
                "API route not found."
        });

    }
);


/*
=====================================================
ERROR HANDLER
=====================================================
*/

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


/*
=====================================================
START SERVER
=====================================================
*/

async function startServer() {

    try {

        await sequelize.authenticate();


        console.log(
            "Connected to SQLite database through Sequelize."
        );


        await sequelize.sync();


        console.log(
            "Database models synchronized."
        );


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


    } catch (error) {

        console.error(
            "Unable to start server:",
            error
        );

    }

}


startServer();