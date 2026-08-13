const { Sequelize } = require("sequelize");
const path = require("path");

const databasePath = path.join(__dirname, "database", "recipes.db");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: databasePath,
    logging: false
});

module.exports = sequelize;