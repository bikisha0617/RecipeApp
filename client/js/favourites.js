const favouriteGrid = document.getElementById("favouriteGrid");
const searchInput = document.getElementById("searchFavourite");
const userId = localStorage.getItem("userId");
let favouriteRecipes = [];

// Check login
if (!userId) {
    favouriteGrid.innerHTML = `
        <div class="empty-state">
            <h2>Please log in first</h2>
            <a href="login.html">Login</a>
        </div>
    `;
} else {
    loadFavourites();
}

// Load favourites from server
async function loadFavourites() {
    try {
        const response = await fetch(`http://localhost:3000/api/favourites/${userId}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Could not load favourites.");
            return;
        }
        favouriteRecipes = data;
        displayRecipes(favouriteRecipes);
    } catch (error) {
        console.error(error);
        favouriteGrid.innerHTML = `
            <div class="empty-state">
                <h2>Could not connect to server</h2>
            </div>
        `;
    }
}

// Display favourites
function displayRecipes(recipeList) {
    favouriteGrid.innerHTML = "";
    if (recipeList.length === 0) {
        favouriteGrid.innerHTML = `
            <div class="empty-state">
                <h2>No favourites yet</h2>
                <a href="index.html">Explore</a>
            </div>
        `;
        return;
    }

    recipeList.forEach(function(recipe) {
        favouriteGrid.innerHTML += `
            <div class="recipe-card">
                <a href="recipe.html?id=${recipe.id}">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </a>

                <div class="recipe-content">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.time}</p>
                    <div class="buttons">
                        <button class="view-btn" onclick="viewRecipe(${recipe.id})">View</button>
                        <button class="remove-btn" onclick="removeFavourite(${recipe.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Search favourites
if (searchInput) {
    searchInput.addEventListener("keyup", function() {
        const keyword = this.value.toLowerCase();
        const filtered = favouriteRecipes.filter(function(recipe) {
            return recipe.title.toLowerCase().includes(keyword);
        });
        displayRecipes(filtered);
    });
}

// Remove favourite
async function removeFavourite(recipeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/favourites/${userId}/${recipeId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Could not remove favourite.");
            return;
        }

        // Remove from current page
        favouriteRecipes = favouriteRecipes.filter(function(recipe) {
            return recipe.id !== recipeId;
        });
        displayRecipes(favouriteRecipes);
    } catch (error) {
        console.error(error);
        alert("Could not connect to server.");
    }
}

// View recipe
function viewRecipe(id) {
    window.location.href = "recipe.html?id=" + id;
}