const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize, connectDatabase } = require("./database");

// Import models so Sequelize knows about them
require("./models");

// Routes
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const favouriteRoutes = require("./routes/favourites");
const userRoutes = require("./routes/users");

const app = express();

const PORT = process.env.PORT || 3000;


/*
====================================================
MIDDLEWARE
====================================================
*/

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/*
====================================================
SERVE UPLOADED IMAGES
====================================================
*/

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


/*
====================================================
TEST ROUTE
====================================================
*/

app.get("/", function (req, res) {

    res.json({
        message: "Recipe App backend is running!"
    });

});


/*
====================================================
DATABASE TEST
====================================================
*/

app.get("/api/test-db", async function (req, res) {

    try {

        await sequelize.authenticate();

        res.json({
            message: "SQLite is working with Sequelize!",
            database: "Connected"
        });

    } catch (error) {

        console.error(
            "Database test error:",
            error
        );

        res.status(500).json({
            message: "Database connection failed."
        });

    }

});


/*
====================================================
API ROUTES
====================================================
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
====================================================
404 HANDLER
====================================================
*/

app.use(function (req, res) {

    res.status(404).json({
        message: "API route not found."
    });

});


/*
====================================================
GENERAL ERROR HANDLER
====================================================
*/

app.use(function (error, req, res, next) {

    console.error(
        "Server error:",
        error
    );

    res.status(
        error.status || 500
    ).json({
        message:
            error.message ||
            "Internal server error."
    });

});


/*
====================================================
START SERVER
====================================================
*/

async function startServer() {

    try {

        /*
        --------------------------------------------
        Connect to SQLite
        --------------------------------------------
        */

        const connected =
            await connectDatabase();

        if (!connected) {

            console.error(
                "Server could not connect to database."
            );

            process.exit(1);
        }


        /*
        --------------------------------------------
        Synchronize Sequelize models
        --------------------------------------------
        */

        await sequelize.sync();

        console.log(
            "Sequelize models synchronized."
        );


        /*
        --------------------------------------------
        Start Express
        --------------------------------------------
        */

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
            "Could not start server:",
            error
        );

        process.exit(1);
    }

}


startServer();