const {
    Sequelize
} = require("sequelize");

const path = require("path");

require("dotenv").config();


/*
====================================================
DATABASE PATH
====================================================
*/

const databaseDirectory =
    path.join(
        __dirname,
        "database"
    );


const databasePath =
    path.join(
        databaseDirectory,
        "recipes.db"
    );


/*
====================================================
SEQUELIZE
====================================================
*/

const sequelize =
    new Sequelize({

        dialect: "sqlite",

        storage:
            databasePath,

        logging:
            false,

        define: {

            timestamps:
                false

        }

    });


/*
====================================================
CONNECT DATABASE
====================================================
*/

async function connectDatabase() {

    try {

        await sequelize.authenticate();

        /*
        --------------------------------------------
        Enable SQLite foreign-key enforcement
        --------------------------------------------
        */

        await sequelize.query(
            "PRAGMA foreign_keys = ON;"
        );

        console.log(
            "Connected to SQLite database using Sequelize."
        );

        console.log(
            "SQLite foreign-key enforcement enabled."
        );

        return true;

    } catch (error) {

        console.error(
            "Database connection error:",
            error.message
        );

        return false;

    }

}


/*
====================================================
EXPORT
====================================================
*/

module.exports = {

    sequelize,

    connectDatabase,

    databasePath

};