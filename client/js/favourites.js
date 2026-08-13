const favouriteGrid = document.getElementById("favouriteGrid");
const searchInput = document.getElementById("searchFavourite");
const userId = localStorage.getItem("userId");
let favouriteRecipes = [];

function getImageUrl(image) {
    if (!image) {
        return "images/placeholder.jpg";
    }
    image = String(image).trim();
    if (image === "") {
        return "images/placeholder.jpg";
    }
    // Complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }
    // Contains /uploads/
    if (image.includes("/uploads/")) {
        const filename = image.split("/uploads/").pop();
        return ("http://localhost:3000/uploads/" + filename);
    }
    // uploads/filename
    if (image.startsWith("uploads/")) {
        return ("http://localhost:3000/" + image);
    }
    // Filename only
    return ("http://localhost:3000/uploads/" + image);
}

// Login Check
if (!userId) {
    if (favouriteGrid) {
        favouriteGrid.innerHTML = `
            <div class="empty-state">
                <h2>Please log in first</h2>
                <a href="login.html">Login</a>
            </div>
        `;
    }
} else {
    loadFavourites();
}

// Load Favourites
async function loadFavourites() {
    try {
        const response = await fetch(`http://localhost:3000/api/favourites/${userId}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Could not load favourites.");
            return;
        }

        favouriteRecipes = Array.isArray(data) ? data : [];
        displayRecipes(favouriteRecipes);
    } catch (error) {
        console.error("Load favourites error:",error);
        if (favouriteGrid) {
            favouriteGrid.innerHTML = `
                <div class="empty-state">
                    <h2>Could not connect to server</h2>
                </div>
            `;
        }
    }
}

// Display Favourites
function displayRecipes(recipeList) {
    if (!favouriteGrid) {
        return;
    }
    favouriteGrid.innerHTML = "";
    if (!recipeList || recipeList.length === 0) {
        favouriteGrid.innerHTML = `
            <div class="empty-state">
                <h2>No favourites yet</h2>
                <a href="index.html">Explore</a>
            </div>
        `;
        return;
    }

    recipeList.forEach(
        function (recipe) {
            const image = getImageUrl(recipe.image);
            favouriteGrid.innerHTML += `
                <div class="recipe-card">
                    <a href="recipe.html?id=${Number(recipe.id)}">
                        <img src="${image}" alt="${recipe.title || "Recipe"}" class="recipe-image" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                    </a>
                    <div class="recipe-content">
                        <h3>${recipe.title || ""}</h3>
                        <p>${recipe.time || "-"} mins</p>
                        <div class="buttons">
                            <button type="button" class="view-btn" onclick="viewRecipe(${Number(recipe.id)})">View</button>
                            <button type="button" class="remove-btn" onclick="removeFavourite(${Number(recipe.id)})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }
    );
}

// Search
if (searchInput) {
    searchInput.addEventListener("keyup",function () {
        const keyword = this.value.toLowerCase().trim();
        const filtered = favouriteRecipes.filter(function (recipe) {
            return (recipe.title && recipe.title.toLowerCase().includes(keyword));
        });
        displayRecipes(filtered);
        }
    );
}

// Remove Favourite
async function removeFavourite(recipeId) {
    try {
        const response = await fetch("http://localhost:3000/api/favourites",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        user_id: Number(userId),
                        recipe_id: Number(recipeId)
                    })
                }
            );
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Could not remove favourite.");
            return;
        }
        favouriteRecipes = favouriteRecipes.filter(function (recipe) {
            return (Number(recipe.id) !== Number(recipeId));
                }
            );
        displayRecipes(favouriteRecipes);
    } catch (error) {
        console.error("Remove favourite error:",error);
        alert("Could not connect to server.");
    }
}

// View Recipe
function viewRecipe(id) {
    window.location.href = `recipe.html?id=${Number(id)}`;
}