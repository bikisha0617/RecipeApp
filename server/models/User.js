const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name is required."
                },
                len: {
                    args: [2, 100],
                    msg: "Name must be between 2 and 100 characters."
                }
            }
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Email is required."
                },
                isEmail: {
                    msg: "Please provide a valid email address."
                }
            }
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        notifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        darkMode: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "users",
        timestamps: false
    }
);

module.exports = User;