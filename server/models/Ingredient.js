const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Ingredient = sequelize.define(
    "Ingredient",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        ingredient: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Ingredient cannot be empty."
                }
            }
        }
    },
    {
        tableName: "ingredients",
        timestamps: false
    }
);

module.exports = Ingredient;