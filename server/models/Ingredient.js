const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Ingredient = sequelize.define(
    "Ingredient",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        recipeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "recipe_id"
        },

        ingredient: {
            type: DataTypes.TEXT,
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