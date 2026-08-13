const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

const databaseDirectory = path.join(__dirname, "database");
const databasePath = path.join(databaseDirectory, "recipes.db");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: databasePath,
    logging: false,
    define: {
        timestamps: false
    }
});

async function connectDatabase() {
    try {
        await sequelize.authenticate();

        await sequelize.query("PRAGMA foreign_keys = ON;");

        console.log("Connected to SQLite database using Sequelize.");
        console.log("SQLite foreign-key enforcement enabled.");

        return true;
    } catch (error) {
        console.error("Database connection error:", error.message);
        return false;
    }
}

module.exports = {
    sequelize,
    connectDatabase,
    databasePath
};