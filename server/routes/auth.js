const express = require("express");
const router = express.Router();
const db = require("../database");

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

    db.run(sql, [name, email, password], function(err) {

        if (err) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }

        res.json({
            message: "Account created successfully.",
            userId: this.lastID
        });
    });
});


router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE email = ? AND password = ?
    `;

    db.get(sql, [email, password], (err, user) => {

        if (err) {
            return res.status(500).json({
                message: "Database error."
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({
            message: "Login successful.",
            user
        });
    });
});


module.exports = router;