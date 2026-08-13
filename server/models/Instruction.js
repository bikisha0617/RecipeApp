const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Instruction = sequelize.define(
    "Instruction",
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

        instruction: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Instruction cannot be empty."
                }
            }
        }
    },
    {
        tableName: "instructions",
        timestamps: false
    }
);

module.exports = Instruction;