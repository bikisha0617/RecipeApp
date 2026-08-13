const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {

    const Instruction = sequelize.define(
        "Instruction",
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

            instruction: {
                type: DataTypes.TEXT,
                allowNull: false,

                validate: {
                    notEmpty: {
                        msg: "Instruction cannot be empty."
                    }
                }
            }
        },
        {
            tableName: "instructions",
            timestamps: false
        }
    );


    return Instruction;
};