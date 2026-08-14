const User = require("./User");
const Admin = require("./Admin");
const Recipe = require("./Recipe");
const Ingredient = require("./Ingredient");
const Instruction = require("./Instruction");
const Favourite = require("./Favourite");

User.hasMany(Recipe, {
    foreignKey: "userId",
    as: "recipes",
    onDelete: "CASCADE"
});
Recipe.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

Recipe.hasMany(Ingredient, {
    foreignKey: "recipeId",
    as: "ingredients",
    onDelete: "CASCADE"
});
Ingredient.belongsTo(Recipe, {
    foreignKey: "recipeId",
    as: "recipe"
});

Recipe.hasMany(Instruction, {
    foreignKey: "recipeId",
    as: "instructions",
    onDelete: "CASCADE"
});
Instruction.belongsTo(Recipe, {
    foreignKey: "recipeId",
    as: "recipe"
});

User.hasMany(Favourite, {
    foreignKey: "userId",
    as: "favourites",
    onDelete: "CASCADE"
});
Favourite.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

Recipe.hasMany(Favourite, {
    foreignKey: "recipeId",
    as: "favourites",
    onDelete: "CASCADE"
});
Favourite.belongsTo(Recipe, {
    foreignKey: "recipeId",
    as: "recipe"
});

module.exports = {User,Admin,Recipe,Ingredient,Instruction,Favourite};