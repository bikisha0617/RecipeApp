const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Recipe = sequelize.define(
    "Recipe",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Recipe title is required."
                },
                len: {
                    args: [2, 150],
                    msg: "Recipe title must be between 2 and 150 characters."
                }
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Recipe description is required."
                }
            }
        },

        category: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: ""
        },

        time: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        servings: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        difficulty: {
            type: DataTypes.ENUM("Easy", "Medium", "Hard"),
            allowNull: false,
            defaultValue: "Easy"
        },

        image: {
            type: DataTypes.STRING(255),
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