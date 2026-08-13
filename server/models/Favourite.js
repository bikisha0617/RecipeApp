const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {

    const Favourite = sequelize.define(
        "Favourite",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "user_id"
            },

            recipeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "recipe_id"
            }
        },
        {
            tableName: "favourites",
            timestamps: false,

            indexes: [
                {
                    unique: true,
                    fields: [
                        "user_id",
                        "recipe_id"
                    ]
                }
            ]
        }
    );


    return Favourite;
};