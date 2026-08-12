const express = require("express");
const cors = require("cors");
const db = require("./database");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const favouriteRoutes = require("./routes/favourites");
const userRoutes = require("./routes/users");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Recipe App backend is running!"
    });
});

// Test database
app.get("/api/test-db", (req, res) => {

    db.get("SELECT 1 AS result", [], (err, row) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "SQLite is working!",
            result: row.result
        });
    });

});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});