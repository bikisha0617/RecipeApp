const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Instruction = sequelize.define(
    "Instruction",
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