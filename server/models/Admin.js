const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Admin = sequelize.define(
    "Admin",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Username is required."
                },
                len: {
                    args: [3, 50],
                    msg: "Username must be between 3 and 50 characters."
                }
            }
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: "admins",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Admin;