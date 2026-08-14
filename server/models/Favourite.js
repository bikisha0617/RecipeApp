const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Favourite = sequelize.define("Favourite",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
                fields: ["user_id", "recipe_id"]
            }
        ]
    }
);
module.exports = Favourite;