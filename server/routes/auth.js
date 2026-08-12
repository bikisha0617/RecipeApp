const express = require("express");
const router = express.Router();
const db = require("../database");


/* =========================
   REGISTER
========================= */

router.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [name.trim(), email.trim().toLowerCase(), password],
        function (err) {

            if (err) {

                console.error("Register error:", err.message);

                if (err.message.includes("UNIQUE")) {

                    return res.status(400).json({
                        message: "An account with this email already exists."
                    });
                }

                return res.status(500).json({
                    message: "Could not create account."
                });
            }

            res.json({
                message: "Account created successfully.",
                userId: this.lastID
            });
        }
    );
});


/* =========================
   LOGIN
========================= */

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    const sql = `
        SELECT id, name, email, password
        FROM users
        WHERE LOWER(email) = ?
    `;

    db.get(
        sql,
        [cleanEmail],
        (err, user) => {

            if (err) {

                console.error("Login database error:", err.message);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (!user) {

                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            /*
             * Compare the password entered by the user
             * with the password stored in SQLite.
             */

            if (password !== user.password) {

                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            res.json({
                message: "Login successful.",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    );
});


module.exports = router;