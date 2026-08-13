const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Favourite = sequelize.define(
    "Favourite",
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

        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false
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