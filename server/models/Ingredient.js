const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {

    const Ingredient = sequelize.define(
        "Ingredient",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
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


    return Ingredient;
};