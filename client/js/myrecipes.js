const recipeGrid = document.getElementById("myRecipeGrid");
const searchInput = document.getElementById("searchRecipe");
let userRecipes = [];

if (!isLoggedIn()) {
    alert("Please login first.");
    window.location.href = "login.html";
}

function getToken() {
    const possibleKeys = ["token","authToken","accessToken","jwt"];
    for (const key of possibleKeys) {
        const value = localStorage.getItem(key);
        if (value) {
            return value;
        }
    }
    return null;
}

function getImageUrl(image) {
    if (!image) {
        return "images/placeholder.jpg";
    }
    const cleanImage = String(image).trim();
    if (!cleanImage) {
        return "images/placeholder.jpg";
    }
    if (cleanImage.startsWith("http://") || cleanImage.startsWith("https://")) {
        return cleanImage;
    }
    if (cleanImage.startsWith("uploads/")) {
        return "http://localhost:3000/" + cleanImage;
    }
    if (cleanImage.startsWith("/uploads/")) {
        return "http://localhost:3000" + cleanImage;
    }
    return ("http://localhost:3000/uploads/" +encodeURIComponent(cleanImage));
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* Display recipes */
function displayRecipes(recipeList) {
    if (!recipeGrid) {
        return;
    }
    recipeGrid.innerHTML = "";
    if (!Array.isArray(recipeList) || recipeList.length === 0) {
        recipeGrid.innerHTML = `
            <p class="empty-message">
                You haven't created any recipes yet.
            </p>
        `;
        return;
    }
    recipeList.forEach(function (recipe) {
        const recipeId = Number(recipe.id);
        const imageUrl =getImageUrl(recipe.image);
        const title =escapeHtml(recipe.title || "Untitled Recipe");
        const time =escapeHtml(recipe.time + "mins" || "N/A");
        const difficulty = escapeHtml(recipe.difficulty ||"Easy");
        recipeGrid.innerHTML += `
            <div class="recipe-box">
                <img src="${imageUrl}" alt="${title}" class="recipe-image"
                onerror="this.onerror=null;
                        this.src='images/placeholder.jpg';">
                <div class="recipe-info">
                    <h3>${title}</h3>
                    <p>${time} mins</p>
                    <p>${difficulty}</p>
                    <div class="recipe-actions">
                        <button type="button" class="view-btn" onclick="viewRecipe(${recipeId})">
                            View
                        </button>
                        <button type="button" class="edit-btn" onclick="editRecipe(${recipeId})">
                            Edit
                        </button>
                        <button type="button" class="delete-btn" onclick="deleteRecipe(${recipeId})">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

async function loadRecipes() {
    if (!isLoggedIn()) {
        return;
    }
    if (!recipeGrid) {
        return;
    }
    recipeGrid.innerHTML = `
        <p class="loading-message">
            Loading your recipes...
        </p>
    `;
    try {
        const recipes = await getMyRecipes();
        if (!Array.isArray(recipes)) {
            console.error("Invalid recipes response:",recipes);
            recipeGrid.innerHTML = `
                <p class="error-message">
                    Could not load your recipes.
                </p>
            `;
            return;
        }
        userRecipes = recipes;
        displayRecipes(userRecipes);
    } catch (error) {
        console.error("Load my recipes error:", error);
        recipeGrid.innerHTML = `
            <div class="error-message">
                <p>
                    ${escapeHtml(error.message || "Could not connect to the server.")}
                </p>
                <button type="button" onclick="loadRecipes()">
                    Try Again
                </button>
            </div>
        `;
    }
}

/* Search */
if (searchInput) {
    searchInput.addEventListener("input",
        function () {
            const keyword =searchInput.value.toLowerCase().trim();
            if (!keyword) {
                displayRecipes(userRecipes);
                return;
            }
            const filtered =userRecipes.filter(
                function (recipe) {
                    const title =String(recipe.title || "").toLowerCase();
                    const description =String(recipe.description || "").toLowerCase();
                    const category =String(recipe.category || "").toLowerCase();
                    return (title.includes(keyword) || description.includes(keyword) || category.includes(keyword));
                }
            );
            if (filtered.length === 0) {
                recipeGrid.innerHTML = `
                    <p class="empty-message">
                        No recipes found.
                    </p>
                `;
                return;
            }
            displayRecipes(filtered);
        }
    );
}

/* View */
function viewRecipe(id) {
    const recipeId = Number(id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
        alert("Invalid recipe.");
        return;
    }
    window.location.href ="recipe.html?id=" + recipeId;
}

/* Edit */
function editRecipe(id) {
    const recipeId = Number(id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
        alert("Invalid recipe.");
        return;
    }
    window.location.href ="edit.html?id=" + recipeId;
}

/* Delete */
async function deleteRecipe(id) {
    const recipeId = Number(id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
        alert("Invalid recipe.");
        return;
    }
    const recipe =userRecipes.find(
        function (item) {
            return Number(item.id) === recipeId;
        }
    );
    const recipeTitle =recipe && recipe.title ? recipe.title : "this recipe";
    const confirmed = confirm('Are you sure you want to delete "' +recipeTitle +'"?');
    if (!confirmed) {
        return;
    }
    const token = getToken();
    if (!token) {
        alert("Your session has expired. Please login again.");
        window.location.href = "login.html";
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/api/recipes/" + recipeId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );
        let data = {};
        try {
            data = await response.json();
        } catch (jsonError) {
            data = {};
        }
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert(data.message || "You are not authorized to delete this recipe.");
                return;
            }
            throw new Error(data.message || "Could not delete recipe.");
        }
        userRecipes =userRecipes.filter(
            function (item) {
                return (Number(item.id) !==recipeId);
            }
        );
        displayRecipes(userRecipes);
        alert(data.message || "Recipe deleted successfully.");
    } catch (error) {
        console.error("Delete recipe error:",error);
        alert(error.message || "Could not delete recipe.");
    }
}
loadRecipes();