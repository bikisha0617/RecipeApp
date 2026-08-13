const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Admin = sequelize.define(
    "Admin",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Username is required."
                },
                len: {
                    args: [3, 100],
                    msg: "Username must be between 3 and 100 characters."
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "created_at",
            defaultValue: DataTypes.NOW
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "updated_at",
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "admins",

        timestamps: false
    }
);

module.exports = Admin;