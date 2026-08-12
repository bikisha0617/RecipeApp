const params = new URLSearchParams(window.location.search);
const recipeId = Number(params.get("id"));

const userId = localStorage.getItem("userId");

let recipe = null;

// Load recipe from server
async function loadRecipe() {
    try {
        const response = await fetch(
            `http://localhost:3000/api/recipes/${recipeId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Recipe not found.");
        }

        recipe = data;

        displayRecipe(recipe);
        loadFavouriteStatus();

    } catch (error) {
        console.error("Load recipe error:", error);

        const recipePage = document.querySelector(".recipe-page");

        if (recipePage) {
            recipePage.innerHTML = `
                <div class="empty-state">
                    <h2>Recipe not found.</h2>
                    <a href="index.html">Back to recipes</a>
                </div>
            `;
        }
    }
}


// Display recipe
function displayRecipe(recipe) {

    const recipeImage = document.getElementById("recipeImage");
    const recipeTitle = document.getElementById("recipeTitle");
    const recipeAuthor = document.getElementById("recipeAuthor");
    const recipeTime = document.getElementById("recipeTime");
    const recipeServings = document.getElementById("recipeServings");
    const recipeDifficulty = document.getElementById("recipeDifficulty");
    const recipeDescription = document.getElementById("recipeDescription");

    if (recipeImage) {
        recipeImage.src =
            recipe.image || "images/recipes/default.jpg";

        recipeImage.alt = recipe.title || "Recipe";
    }

    if (recipeTitle) {
        recipeTitle.textContent = recipe.title || "";
    }

    if (recipeAuthor) {
        recipeAuthor.textContent =
            "By " + (recipe.author || "Unknown");
    }

    if (recipeTime) {
        recipeTime.textContent = recipe.time || "-";
    }

    if (recipeServings) {
        recipeServings.textContent =
            recipe.servings || "-";
    }

    if (recipeDifficulty) {
        recipeDifficulty.textContent =
            recipe.difficulty || "-";
    }

    if (recipeDescription) {
        recipeDescription.textContent =
            recipe.description || "";
    }


    // Ingredients
    const ingredientsList =
        document.getElementById("ingredientsList");

    if (ingredientsList) {

        ingredientsList.innerHTML = "";

        if (
            recipe.ingredients &&
            Array.isArray(recipe.ingredients)
        ) {

            recipe.ingredients.forEach(function (item) {

                const li = document.createElement("li");

                li.textContent = item;

                ingredientsList.appendChild(li);
            });
        }
    }


    // Instructions
    const instructionsList =
        document.getElementById("instructionsList");

    if (instructionsList) {

        instructionsList.innerHTML = "";

        if (
            recipe.instructions &&
            Array.isArray(recipe.instructions)
        ) {

            recipe.instructions.forEach(function (step) {

                const li = document.createElement("li");

                li.textContent = step;

                instructionsList.appendChild(li);
            });
        }
    }


    // Nutrition
    const nutritionList =
        document.getElementById("nutritionList");

    if (nutritionList) {

        nutritionList.innerHTML = "";

        nutritionList.innerHTML = `
            <li>
                Calories:
                ${recipe.calories || "-"} kcal
            </li>

            <li>
                Protein:
                ${recipe.protein || "-"} g
            </li>

            <li>
                Carbs:
                ${recipe.carbs || "-"} g
            </li>

            <li>
                Fat:
                ${recipe.fat || "-"} g
            </li>
        `;
    }
}


// Load favourite status
async function loadFavouriteStatus() {

    const heart = document.getElementById("heart");

    if (!heart) {
        return;
    }

    if (!userId) {

        heart.src =
            "images/icons/HeartUnfilled.png";

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/favourites/${userId}`
        );

        const favourites = await response.json();

        if (!response.ok) {
            return;
        }

        const isFavourite = favourites.some(
            function (item) {
                return Number(item.id) === Number(recipeId);
            }
        );

        updateHeart(isFavourite);

    } catch (error) {

        console.error(
            "Load favourite status error:",
            error
        );
    }
}


// Update heart image
function updateHeart(isFavourite) {

    const heart = document.getElementById("heart");

    if (!heart) {
        return;
    }

    if (isFavourite) {

        heart.src =
            "images/icons/HeartFilled.png";

    } else {

        heart.src =
            "images/icons/HeartUnfilled.png";
    }
}


// Toggle favourite
async function toggleFavourite() {

    const heart = document.getElementById("heart");

    if (!userId) {

        alert("Please log in first.");

        window.location.href = "login.html";

        return;
    }

    if (!recipe) {
        return;
    }

    try {

        // Get current favourites
        const getResponse = await fetch(
            `http://localhost:3000/api/favourites/${userId}`
        );

        const favourites = await getResponse.json();

        if (!getResponse.ok) {

            alert(
                favourites.message ||
                "Could not load favourites."
            );

            return;
        }


        const alreadyFavourite = favourites.some(
            function (item) {
                return Number(item.id) === Number(recipe.id);
            }
        );


        if (alreadyFavourite) {

            // Remove favourite
            const response = await fetch(
                "http://localhost:3000/api/favourites",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        user_id: Number(userId),
                        recipe_id: Number(recipe.id)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not remove favourite."
                );

                return;
            }

            updateHeart(false);

        } else {

            // Add favourite
            const response = await fetch(
                "http://localhost:3000/api/favourites",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        user_id: Number(userId),
                        recipe_id: Number(recipe.id)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not add favourite."
                );

                return;
            }

            updateHeart(true);
        }

    } catch (error) {

        console.error(
            "Favourite error:",
            error
        );

        alert(
            "Could not connect to the server."
        );
    }
}


// Heart click
const heart = document.getElementById("heart");

if (heart) {

    heart.onclick = function () {
        toggleFavourite();
    };
}


// Start
loadRecipe();