const { Sequelize } = require("sequelize");
const path = require("path");


/*
=====================================================
DATABASE CONNECTION
=====================================================
*/

const databasePath = path.join(
    __dirname,
    "..",
    "database",
    "recipes.db"
);


const sequelize = new Sequelize(
    {
        dialect: "sqlite",

        storage: databasePath,

        logging: false
    }
);


/*
=====================================================
LOAD MODELS
=====================================================
*/

const User =
    require("./User")(sequelize);

const Recipe =
    require("./Recipe")(sequelize);

const Ingredient =
    require("./Ingredient")(sequelize);

const Instruction =
    require("./Instruction")(sequelize);

const Favourite =
    require("./Favourite")(sequelize);


/*
=====================================================
RELATIONSHIPS
=====================================================
*/


/*
USER → RECIPES

One user can create many recipes.
*/

User.hasMany(
    Recipe,
    {
        foreignKey: "userId",
        as: "recipes"
    }
);

Recipe.belongsTo(
    User,
    {
        foreignKey: "userId",
        as: "user"
    }
);


/*
RECIPE → INGREDIENTS

One recipe can contain many ingredients.
*/

Recipe.hasMany(
    Ingredient,
    {
        foreignKey: "recipeId",
        as: "ingredients",

        onDelete: "CASCADE"
    }
);

Ingredient.belongsTo(
    Recipe,
    {
        foreignKey: "recipeId",
        as: "recipe"
    }
);


/*
RECIPE → INSTRUCTIONS

One recipe can contain many instructions.
*/

Recipe.hasMany(
    Instruction,
    {
        foreignKey: "recipeId",
        as: "instructions",

        onDelete: "CASCADE"
    }
);

Instruction.belongsTo(
    Recipe,
    {
        foreignKey: "recipeId",
        as: "recipe"
    }
);


/*
USER → FAVOURITES
*/

User.hasMany(
    Favourite,
    {
        foreignKey: "userId",
        as: "favourites",

        onDelete: "CASCADE"
    }
);

Favourite.belongsTo(
    User,
    {
        foreignKey: "userId",
        as: "user"
    }
);


/*
RECIPE → FAVOURITES
*/

Recipe.hasMany(
    Favourite,
    {
        foreignKey: "recipeId",
        as: "favourites",

        onDelete: "CASCADE"
    }
);

Favourite.belongsTo(
    Recipe,
    {
        foreignKey: "recipeId",
        as: "recipe"
    }
);


/*
=====================================================
EXPORT
=====================================================
*/

module.exports = {
    sequelize,
    User,
    Recipe,
    Ingredient,
    Instruction,
    Favourite
};