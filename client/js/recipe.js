const params =
    new URLSearchParams(
        window.location.search
    );

const recipeId =
    Number(params.get("id"));

const userId =
    localStorage.getItem("userId");

let recipe = null;


// ===============================
// Image URL Helper
// ===============================

function getImageUrl(image) {

    if (!image) {
        return "images/placeholder.jpg";
    }

    image = String(image).trim();

    if (image === "") {
        return "images/placeholder.jpg";
    }


    // Already complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }


    // Contains /uploads/
    if (image.includes("/uploads/")) {

        const filename =
            image.split("/uploads/").pop();

        return (
            "http://localhost:3000/uploads/" +
            filename
        );
    }


    // uploads/filename
    if (image.startsWith("uploads/")) {

        return (
            "http://localhost:3000/" +
            image
        );
    }


    // Just filename
    return (
        "http://localhost:3000/uploads/" +
        image
    );
}


// ===============================
// Load Recipe
// ===============================

async function loadRecipe() {

    if (!recipeId) {

        showRecipeError(
            "Invalid recipe."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/recipes/${recipeId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Recipe not found."
            );
        }


        recipe = data;


        displayRecipe(recipe);

        loadFavouriteStatus();


    } catch (error) {

        console.error(
            "Load recipe error:",
            error
        );

        showRecipeError(
            "Recipe not found."
        );
    }
}


// ===============================
// Recipe Error
// ===============================

function showRecipeError(message) {

    const recipePage =
        document.querySelector(
            ".recipe-page"
        );


    if (recipePage) {

        recipePage.innerHTML = `
            <div class="empty-state">

                <h2>
                    ${message}
                </h2>

                <a href="index.html">
                    Back to recipes
                </a>

            </div>
        `;
    }
}


// ===============================
// Display Recipe
// ===============================

function displayRecipe(recipe) {

    const recipeImage =
        document.getElementById(
            "recipeImage"
        );

    const recipeTitle =
        document.getElementById(
            "recipeTitle"
        );

    const recipeAuthor =
        document.getElementById(
            "recipeAuthor"
        );

    const recipeTime =
        document.getElementById(
            "recipeTime"
        );

    const recipeServings =
        document.getElementById(
            "recipeServings"
        );

    const recipeDifficulty =
        document.getElementById(
            "recipeDifficulty"
        );

    const recipeDescription =
        document.getElementById(
            "recipeDescription"
        );


    // ===============================
    // Image
    // ===============================

    if (recipeImage) {

        recipeImage.src =
            getImageUrl(recipe.image);

        recipeImage.alt =
            recipe.title || "Recipe";

        recipeImage.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "images/placeholder.jpg";
            };
    }


    // ===============================
    // Basic Information
    // ===============================

    if (recipeTitle) {

        recipeTitle.textContent =
            recipe.title || "";
    }


    if (recipeAuthor) {

        recipeAuthor.textContent =
            "By " +
            (recipe.author || "Unknown");
    }


    if (recipeTime) {

        recipeTime.textContent =
            recipe.time || "-";
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


    // ===============================
    // Ingredients
    // ===============================

    const ingredientsList =
        document.getElementById(
            "ingredientsList"
        );


    if (ingredientsList) {

        ingredientsList.innerHTML = "";


        if (
            Array.isArray(recipe.ingredients) &&
            recipe.ingredients.length > 0
        ) {

            recipe.ingredients.forEach(
                function (item) {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        item;

                    ingredientsList.appendChild(
                        li
                    );
                }
            );

        } else {

            ingredientsList.innerHTML =
                "<li>No ingredients listed.</li>";
        }
    }


    // ===============================
    // Instructions
    // ===============================

    const instructionsList =
        document.getElementById(
            "instructionsList"
        );


    if (instructionsList) {

        instructionsList.innerHTML = "";


        if (
            Array.isArray(recipe.instructions) &&
            recipe.instructions.length > 0
        ) {

            recipe.instructions.forEach(
                function (step) {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        step;

                    instructionsList.appendChild(
                        li
                    );
                }
            );

        } else {

            instructionsList.innerHTML =
                "<li>No instructions listed.</li>";
        }
    }


    // ===============================
    // Nutrition
    // ===============================

    const nutritionList =
        document.getElementById(
            "nutritionList"
        );


    if (nutritionList) {

        nutritionList.innerHTML = `
            <li>
                Calories:
                ${recipe.calories ?? 0} kcal
            </li>

            <li>
                Protein:
                ${recipe.protein ?? 0} g
            </li>

            <li>
                Carbs:
                ${recipe.carbs ?? 0} g
            </li>

            <li>
                Fat:
                ${recipe.fat ?? 0} g
            </li>
        `;
    }
}


// ===============================
// Load Favourite Status
// ===============================

async function loadFavouriteStatus() {

    const heart =
        document.getElementById("heart");


    if (!heart) {
        return;
    }


    if (!userId) {

        updateHeart(false);

        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/favourites/${userId}`
            );


        const favourites =
            await response.json();


        if (!response.ok) {
            return;
        }


        const isFavourite =
            Array.isArray(favourites) &&
            favourites.some(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(recipeId)
                    );
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


// ===============================
// Update Heart
// ===============================

function updateHeart(isFavourite) {

    const heart =
        document.getElementById("heart");


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


// ===============================
// Toggle Favourite
// ===============================

async function toggleFavourite() {

    const heart =
        document.getElementById("heart");


    if (!userId) {

        alert(
            "Please log in first."
        );

        window.location.href =
            "login.html";

        return;
    }


    if (!recipe) {
        return;
    }


    try {

        // ===============================
        // Get current favourites
        // ===============================

        const getResponse =
            await fetch(
                `http://localhost:3000/api/favourites/${userId}`
            );


        const favourites =
            await getResponse.json();


        if (!getResponse.ok) {

            alert(
                favourites.message ||
                "Could not load favourites."
            );

            return;
        }


        const alreadyFavourite =
            favourites.some(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(recipe.id)
                    );
                }
            );


        // ===============================
        // Remove Favourite
        // ===============================

        if (alreadyFavourite) {

            const response =
                await fetch(
                    "http://localhost:3000/api/favourites",
                    {
                        method: "DELETE",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            user_id:
                                Number(userId),

                            recipe_id:
                                Number(recipe.id)
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not remove favourite."
                );

                return;
            }


            updateHeart(false);


        } else {

            // ===============================
            // Add Favourite
            // ===============================

            const response =
                await fetch(
                    "http://localhost:3000/api/favourites",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            user_id:
                                Number(userId),

                            recipe_id:
                                Number(recipe.id)
                        })
                    }
                );


            const data =
                await response.json();


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


// ===============================
// Heart Click
// ===============================

const heart =
    document.getElementById("heart");


if (heart) {

    heart.addEventListener(
        "click",
        toggleFavourite
    );
}


// ===============================
// Start
// ===============================

loadRecipe();