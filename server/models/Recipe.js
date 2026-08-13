const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Recipe = sequelize.define(
    "Recipe",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "user_id"
        },

        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Recipe title is required."
                },
                len: {
                    args: [2, 200],
                    msg: "Recipe title must be between 2 and 200 characters."
                }
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        category: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        time: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        servings: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        difficulty: {
            type: DataTypes.ENUM(
                "Easy",
                "Medium",
                "Hard"
            ),
            allowNull: false,
            defaultValue: "Easy"
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true
        },

        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: "Calories cannot be negative."
                }
            }
        },

        protein: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: "Protein cannot be negative."
                }
            }
        },

        carbs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: "Carbohydrates cannot be negative."
                }
            }
        },

        fat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: "Fat cannot be negative."
                }
            }
        }
    },
    {
        tableName: "recipes",
        timestamps: false
    }
);

module.exports = Recipe;