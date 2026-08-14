document.addEventListener("DOMContentLoaded", function () {

    if (!isLoggedIn()) {
        window.location.href ="login.html";
        return;
    }
    if (getUserRole() !== "admin") {
        alert("Admin access required.");
        window.location.href ="index.html";
        return;
    }

    /* Dashboard */
    async function loadDashboard() {
        try {
            const data =await apiRequest("/admin/dashboard");
            const usersCount =document.getElementById("usersCount");
            const recipesCount =document.getElementById("recipesCount");
            const favouritesCount =document.getElementById("favouritesCount");
            if (usersCount) {
                usersCount.textContent =data.users ?? 0;
            }
            if (recipesCount) {
                recipesCount.textContent =data.recipes ?? 0;
            }
            if (favouritesCount) {
                favouritesCount.textContent =data.favourites ?? 0;
            }
        } catch (error) {
            console.error("Dashboard error:",error);
            alert(error.message || "Could not load dashboard.");
        }
    }

    /* Users */
    async function loadUsers() {
        try {
            const users =await apiRequest("/admin/users");
            const table =document.getElementById("usersTable");
            if (!table) {
                return;
            }
            table.innerHTML = "";
            if (!Array.isArray(users) || users.length === 0) {
                table.innerHTML ="<tr>" +"<td colspan='4'>" +"No users found." +"</td>" +"</tr>";
                return;
            }
            users.forEach(function (user) {
                const row =document.createElement("tr");
                row.innerHTML ="<td>" +user.id +"</td>" +"<td>" + escapeHtml(user.name) +"</td>" +"<td>" +
                escapeHtml(user.email) +"</td>" +"<td>" +"<button " +"class='delete' " +"data-id='" +Number(user.id) +"'>" +
                "Delete" +"</button>" +"</td>";
                const button =row.querySelector("button");
                button.addEventListener("click",function () {
                    deleteUser(user.id);
                });
                table.appendChild(row);
            });
        } catch (error) {
            console.error("Users error:",error);
            alert(error.message ||"Could not load users.");
        }
    }

    /* Recipes */
    async function loadRecipes() {
        try {
            const recipes =await apiRequest("/admin/recipes");
            const table =document.getElementById("recipesTable");
            if (!table) {
                return;
            }
            table.innerHTML = "";
            if (
                !Array.isArray(recipes) || recipes.length === 0
            ) {
                table.innerHTML =
                    "<tr>" +
                    "<td colspan='4'>" +"No recipes found." +"</td>" +
                    "</tr>";
                return;
            }
            recipes.forEach(function (recipe) {
                const row =document.createElement("tr");
                row.innerHTML ="<td>" +recipe.id +"</td>" +
                "<td>" +escapeHtml(recipe.title) +"</td>" +
                "<td>" +escapeHtml(recipe.author ||"Recipe App") +"</td>" +
                "<td>" +"<button " +"class='delete' " +"data-id='" +Number(recipe.id) +"'>" +"Delete" +"</button>" +"</td>";
                const button =row.querySelector("button");
                button.addEventListener("click",function () {
                    deleteAdminRecipe(recipe.id);
                });
                table.appendChild(row);
            });
        } catch (error) {
            console.error("Recipes error:",error);
            alert(error.message ||"Could not load recipes.");
        }
    }

    /* Delete Users */
    async function deleteUser(id) {
        if (!confirm("Delete this user?")
        ) {
            return;
        }
        try {
            const result =await apiRequest("/admin/users/" +Number(id),
                {
                    method: "DELETE"
                }
            );
            alert(result.message ||"User deleted.");
            await loadDashboard();
            await loadUsers();
            await loadRecipes();
        } catch (error) {
            console.error("Delete user error:",error);
            alert(error.message ||"Could not delete user.");
        }
    }

    /* Delete Recipe */
    async function deleteAdminRecipe(id) {
        if (!confirm("Delete this recipe?")) {
            return;
        }
        try {
            const result =await apiRequest("/admin/recipes/" +Number(id),
                {
                    method: "DELETE"
                }
            );
            alert(result.message ||"Recipe deleted.");
            await loadDashboard();
            await loadRecipes();
        } catch (error) {
            console.error("Delete recipe error:",error);
            alert(error.message ||"Could not delete recipe.");
        }
    }

    function escapeHtml(value) {
        if (value === null ||value === undefined) {
            return "";
        }
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    loadDashboard();
    loadUsers();
    loadRecipes();
});