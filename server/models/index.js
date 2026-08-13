const sequelize = require("../database");

const User = require("./User");
const Admin = require("./Admin");
const Recipe = require("./Recipe");
const Ingredient = require("./Ingredient");
const Instruction = require("./Instruction");
const Favourite = require("./Favourite");

/*
=====================================================
USER ↔ RECIPE
=====================================================
*/

User.hasMany(Recipe, {
    foreignKey: "user_id",
    as: "recipes",
    onDelete: "CASCADE"
});

Recipe.belongsTo(User, {
    foreignKey: "user_id",
    as: "author"
});


/*
=====================================================
RECIPE ↔ INGREDIENT
=====================================================
*/

Recipe.hasMany(Ingredient, {
    foreignKey: "recipe_id",
    as: "ingredients",
    onDelete: "CASCADE"
});

Ingredient.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe"
});


/*
=====================================================
RECIPE ↔ INSTRUCTION
=====================================================
*/

Recipe.hasMany(Instruction, {
    foreignKey: "recipe_id",
    as: "instructions",
    onDelete: "CASCADE"
});

Instruction.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe"
});


/*
=====================================================
USER ↔ FAVOURITE
=====================================================
*/

User.hasMany(Favourite, {
    foreignKey: "user_id",
    as: "favourites",
    onDelete: "CASCADE"
});

Favourite.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});


/*
=====================================================
RECIPE ↔ FAVOURITE
=====================================================
*/

Recipe.hasMany(Favourite, {
    foreignKey: "recipe_id",
    as: "favourites",
    onDelete: "CASCADE"
});

Favourite.belongsTo(Recipe, {
    foreignKey: "recipe_id",
    as: "recipe"
});


module.exports = {
    sequelize,
    User,
    Admin,
    Recipe,
    Ingredient,
    Instruction,
    Favourite
};