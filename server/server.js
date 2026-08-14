const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { sequelize, connectDatabase } = require("./database");
require("./models");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const favouriteRoutes = require("./routes/favourites");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const clientDir = path.join(__dirname, "..", "client");
const uploadsDir = path.join(__dirname, "uploads");
app.use(cors());
app.use(
    express.json({
        limit: "1mb"
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

app.use("/uploads",express.static(uploadsDir));
app.use(express.static(clientDir));

app.get("/api/health", async function (req, res) {
    try {
        await sequelize.authenticate();
        return res.json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        console.error("Health check error:", error);
        return res.status(503).json({
            status: "error",
            database: "disconnected"
        });
    }
});

app.get("/api/test-db", async function (req, res) {
    try {
        await sequelize.authenticate();
        return res.json({
            message: "SQLite is working with Sequelize!",
            database: "Connected"
        });
    } catch (error) {
        console.error("Database test error:", error);
        return res.status(500).json({
            message: "Database connection failed."
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api", function (req, res) {
    return res.json({
        message: "Recipe App API is running.",
        status: "ok"
    });
});

app.use("/api", function (req, res) {
    return res.status(404).json({
        message: "API route not found."
    });
});

app.get(/.*/, function (req, res, next) {
    if (req.path.startsWith("/api/")) {
        return next();
    }
    return res.sendFile(
        path.join(clientDir, "index.html")
    );
});

app.use(function (error, req, res, next) {
    console.error("Server error:", error);
    if (res.headersSent) {
        return next(error);
    }
    return res.status(error.status || 500).json({
        message:error.message || "Internal server error."
    });
});

async function startServer() {
    try {
        const connected = await connectDatabase();
        if (!connected) {
            process.exit(1);
        }
        await sequelize.sync();
        app.listen(PORT, function () {
            console.log(`Recipe App running at http://localhost:${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error("Could not start server:",error);
        process.exit(1);
    }
}

startServer();