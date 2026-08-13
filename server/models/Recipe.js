const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {

    const Recipe = sequelize.define(
        "Recipe",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "user_id"
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
                allowNull: true
            },

            category: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: ""
            },

            time: {
                type: DataTypes.STRING(50),
                allowNull: false,

                validate: {
                    notEmpty: {
                        msg: "Cooking time is required."
                    }
                }
            },

            servings: {
                type: DataTypes.STRING(50),
                allowNull: false,

                validate: {
                    notEmpty: {
                        msg: "Servings are required."
                    }
                }
            },

            difficulty: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: "Easy",

                validate: {
                    isIn: {
                        args: [
                            [
                                "Easy",
                                "Medium",
                                "Hard"
                            ]
                        ],
                        msg: "Difficulty must be Easy, Medium or Hard."
                    }
                }
            },

            image: {
                type: DataTypes.STRING(500),
                allowNull: true
            },

            calories: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

            protein: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

            carbs: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

            fat: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            tableName: "recipes",
            timestamps: false
        }
    );


    return Recipe;
};