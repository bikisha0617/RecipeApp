const express = require("express");
const router = express.Router();
const db = require("../database");

// Get user
router.get("/:id", (req, res) => {
    db.get(
        `SELECT id, name, email, notifications, darkMode FROM users WHERE id = ?`, [req.params.id], (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }
            res.json(user);
        }
    );
});

// Update user
router.put("/:id", (req, res) => {
    const { name, email, notifications, darkMode } = req.body;
    db.run(
        `
        UPDATE users SET name = ?, email = ?, notifications = ?, darkMode = ? WHERE id = ?
        `,
        [
            name,
            email,
            notifications ? 1 : 0,
            darkMode ? 1 : 0,
            req.params.id
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    message: "Could not update user."
                });
            }
            res.json({
                message: "Settings updated successfully."
            });
        }
    );
});

// Delete account
router.delete("/:id", (req, res) => {
    const userId = req.params.id;
    db.run(
        `DELETE FROM favourites WHERE user_id = ?`,[userId]
    );
    db.run(
        `DELETE FROM ingredients WHERE recipe_id IN (SELECT id FROM recipes WHERE user_id = ?)`,[userId]
    );
    db.run(
        `DELETE FROM instructions WHERE recipe_id IN (SELECT id FROM recipes WHERE user_id = ?)`,[userId]
    );
    db.run(
        `DELETE FROM recipes WHERE user_id = ?`,[userId]
    );
    db.run(
        `DELETE FROM users WHERE id = ?`,[userId],
        function(err) {
            if (err) {
                return res.status(500).json({
                    message: "Could not delete account."
                });
            }
            res.json({
                message: "Account deleted successfully."
            });
        }
    );
});
module.exports = router;