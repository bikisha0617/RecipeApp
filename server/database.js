const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

const databasePath = path.join(
    __dirname,
    "database",
    "recipes.db"
);

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: databasePath,
    logging: false
});

async function connectDatabase() {
    try {
        await sequelize.authenticate();

        console.log("Connected to SQLite database using Sequelize.");

        return true;
    } catch (error) {
        console.error(
            "Database connection error:",
            error.message
        );

        return false;
    }
}

module.exports = {
    sequelize,
    connectDatabase
};