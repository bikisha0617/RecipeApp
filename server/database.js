const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(
    __dirname,
    "database",
    "recipes.db"
);


const db = new sqlite3.Database(
    dbPath,
    (err) => {

        if (err) {

            console.error(
                "Database connection error:",
                err.message
            );

        } else {

            console.log(
                "Connected to SQLite database."
            );
        }
    }
);


// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");


db.serialize(() => {


    // ==================================================
    // USERS
    // ==================================================

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            notifications INTEGER DEFAULT 0,
            darkMode INTEGER DEFAULT 0
        )
    `);


    // ==================================================
    // RECIPES
    // ==================================================

    db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            title TEXT NOT NULL,

            description TEXT,

            category TEXT,

            time TEXT,

            servings TEXT,

            difficulty TEXT,

            image TEXT,

            ingredients TEXT,

            instructions TEXT,

            calories INTEGER DEFAULT 0,

            protein INTEGER DEFAULT 0,

            carbs INTEGER DEFAULT 0,

            fat INTEGER DEFAULT 0,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
        )
    `);


    // ==================================================
    // INGREDIENTS
    // ==================================================

    db.run(`
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            recipe_id INTEGER NOT NULL,

            ingredient TEXT NOT NULL,

            FOREIGN KEY (recipe_id)
                REFERENCES recipes(id)
                ON DELETE CASCADE
        )
    `);


    // ==================================================
    // INSTRUCTIONS
    // ==================================================

    db.run(`
        CREATE TABLE IF NOT EXISTS instructions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            recipe_id INTEGER NOT NULL,

            instruction TEXT NOT NULL,

            FOREIGN KEY (recipe_id)
                REFERENCES recipes(id)
                ON DELETE CASCADE
        )
    `);


    // ==================================================
    // FAVOURITES
    // ==================================================

    db.run(`
        CREATE TABLE IF NOT EXISTS favourites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            recipe_id INTEGER NOT NULL,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            FOREIGN KEY (recipe_id)
                REFERENCES recipes(id)
                ON DELETE CASCADE,

            UNIQUE(user_id, recipe_id)
        )
    `);

});


module.exports = db;