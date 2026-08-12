const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");

let recipes = [];
let favourites = [];


// Load favourites from localStorage for now
favourites = JSON.parse(localStorage.getItem("favourites")) || [];


// Load recipes from server
async function loadRecipes() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/recipes"
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Could not load recipes.");
            return;
        }

        recipes = data;

        displayRecipes(recipes);

    } catch (error) {

        console.error("Load recipes error:", error);

        if (recipeContainer) {
            recipeContainer.innerHTML = `
                <div class="empty-state">
                    <h2>Could not connect to server.</h2>
                </div>
            `;
        }
    }
}


// Display recipes
function displayRecipes(recipeList) {

    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = "";

    if (recipeList.length === 0) {

        recipeContainer.innerHTML = `
            <div class="empty-state">
                <h2>No recipes found.</h2>
            </div>
        `;

        return;
    }

    recipeList.forEach(function (recipe) {

        const isFavourite = favourites.includes(recipe.id);

        recipeContainer.innerHTML += `
            <div class="recipe-card">

                <a href="recipe.html?id=${recipe.id}">
                    <img
                        src="${recipe.image || "images/recipes/default.jpg"}"
                        class="recipe-image"
                        alt="${recipe.title}"
                    >
                </a>

                <div class="recipe-content">

                    <h3 class="recipe-title">
                        ${recipe.title}
                    </h3>

                    <p class="recipe-author">
                        By ${recipe.author || "Unknown"}
                    </p>

                    <div class="recipe-footer">

                        <span class="time">
                            ${recipe.time}
                        </span>

                        <img
                            src="${
                                isFavourite
                                ? "images/icons/HeartFilled.png"
                                : "images/icons/HeartUnfilled.png"
                            }"
                            class="heart"
                            onclick="toggleFavourite(${recipe.id})"
                        >

                    </div>

                </div>

            </div>
        `;
    });
}


// Search
if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword = searchInput.value
            .toLowerCase()
            .trim();

        const filteredRecipes = recipes.filter(function (recipe) {

            return recipe.title
                .toLowerCase()
                .includes(keyword);

        });

        displayRecipes(filteredRecipes);

    });
}


// Toggle favourite
async function toggleFavourite(recipeId) {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please log in to favourite recipes.");
        window.location.href = "login.html";
        return;
    }

    const isFavourite = favourites.includes(recipeId);

    try {

        let response;

        if (!isFavourite) {

            response = await fetch(
                "http://localhost:3000/api/favourites",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: Number(userId),
                        recipe_id: recipeId
                    })
                }
            );

        } else {

            response = await fetch(
                `http://localhost:3000/api/favourites/${userId}/${recipeId}`,
                {
                    method: "DELETE"
                }
            );

        }

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Could not update favourite.");
            return;
        }

        // Update local display
        if (!isFavourite) {

            favourites.push(recipeId);

        } else {

            favourites = favourites.filter(function (id) {
                return id !== recipeId;
            });

        }

        localStorage.setItem(
            "favourites",
            JSON.stringify(favourites)
        );

        displayRecipes(recipes);

    } catch (error) {

        console.error("Favourite error:", error);

        alert("Could not connect to server.");

    }
}


// Login/profile section
const loginBtn = document.getElementById("loginBtn");
const profileSection = document.getElementById("profileSection");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

const loggedIn =
    localStorage.getItem("loggedIn") === "true";


if (loggedIn) {

    if (loginBtn) {
        loginBtn.style.display = "none";
    }

    if (profileSection) {
        profileSection.style.display = "flex";
    }

} else {

    if (loginBtn) {
        loginBtn.style.display = "block";
    }

    if (profileSection) {
        profileSection.style.display = "none";
    }

}


// Login button
if (loginBtn) {

    loginBtn.onclick = function () {
        window.location.href = "login.html";
    };

}


// Dropdown
if (dropdownBtn) {

    dropdownBtn.onclick = function (e) {

        e.stopPropagation();

        if (dropdownMenu) {
            dropdownMenu.classList.toggle("show");
        }

    };

}


window.onclick = function () {

    if (dropdownMenu) {
        dropdownMenu.classList.remove("show");
    }

};


// Switch account
const switchAccount =
    document.getElementById("switchAccount");

if (switchAccount) {

    switchAccount.onclick = function () {

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        window.location.href = "login.html";

    };

}


// Start
loadRecipes();