const recipeGrid = document.getElementById("myRecipeGrid");
const searchInput = document.getElementById("searchRecipe");
const userId = localStorage.getItem("userId");
let userRecipes = [];

if (!userId) {
    alert("Please login first.");
    window.location.href = "login.html";
}

// Display recipes

function displayRecipes(recipeList) {
    recipeGrid.innerHTML = "";
    if (recipeList.length === 0) {
        recipeGrid.innerHTML = `
            <p class="empty-message">
                You haven't created any recipes yet.
            </p>
        `;
        return;
    }

    recipeList.forEach(function (recipe) {
        recipeGrid.innerHTML += `
            <div class="recipe-box">
                <img src="${recipe.image || "images/recipes/default.jpg"}" alt="${recipe.title}">
                <div class="recipe-info">
                    <h3>
                        ${recipe.title}
                    </h3>
                    <p>
                        ${recipe.time}
                    </p>
                    <div class="recipe-actions">
                        <button class="view-btn" onclick="viewRecipe(${recipe.id})">View</button>
                        <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Load recipes

async function loadRecipes() {
    try {
        const response = await fetch(`http://localhost:3000/api/recipes/user/${userId}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Could not load recipes.");
            return;
        }
        userRecipes = data;
        displayRecipes(userRecipes);
    } catch (error) {
        console.error("Load recipes error:", error);
        alert("Could not connect to the server.");
    }
}

// Search

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
            const keyword = this.value.toLowerCase().trim();
            const filtered = userRecipes.filter(function (recipe) {
                return recipe.title.toLowerCase().includes(keyword);
            });
            displayRecipes(filtered);
        }
    );
}

// View recipe

function viewRecipe(id) {
    window.location.href = `recipe.html?id=${id}`;
}

// Delete Recipe

async function deleteRecipe(id) {
    const confirmed = confirm("Delete this recipe?");
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/recipes/${id}`,
            {
                method: "DELETE"
            }
        );
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Could not delete recipe.");
            return;
        }
        alert("Recipe deleted.");
        // Reload recipes from database
        loadRecipes();
    } catch (error) {
        console.error("Delete recipe error:", error);
        alert("Could not connect to the server.");
    }
}

// Initial Load
loadRecipes();