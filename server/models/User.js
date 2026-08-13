const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {

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
                    isEmail: {
                        msg: "Please provide a valid email address."
                    }
                }
            },

            password: {
                type: DataTypes.STRING(255),
                allowNull: false,

                validate: {
                    notEmpty: {
                        msg: "Password is required."
                    }
                }
            },

            notifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            darkMode: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,

                field: "darkMode"
            }
        },
        {
            tableName: "users",
            timestamps: false
        }
    );


    return User;
};