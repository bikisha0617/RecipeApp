const API_BASE_URL = "http://localhost:3000";

const params = new URLSearchParams(
    window.location.search
);

const recipeId = Number(
    params.get("id")
);

let recipe = null;

const userId =
    localStorage.getItem("userId");

/*
=====================================================
IMAGE URL
=====================================================
*/

function getImageUrl(image) {

    if (!image) {
        return "images/placeholder.jpg";
    }

    const cleanImage =
        String(image).trim();

    if (!cleanImage) {
        return "images/placeholder.jpg";
    }

    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {
        return cleanImage;
    }

    if (cleanImage.includes("/uploads/")) {

        return (
            API_BASE_URL +
            "/uploads/" +
            cleanImage
                .split("/uploads/")
                .pop()
        );

    }

    if (cleanImage.startsWith("uploads/")) {

        return (
            API_BASE_URL +
            "/" +
            cleanImage
        );

    }

    return (
        API_BASE_URL +
        "/uploads/" +
        cleanImage
    );
}

/*
=====================================================
SHOW ERROR
=====================================================
*/

function showRecipeError(message) {

    const recipePage =
        document.querySelector(
            ".recipe-page"
        );

    if (!recipePage) {
        return;
    }

    recipePage.innerHTML = `
        <div class="empty-state">
            <h2>${message}</h2>
            <p>Please return to the Explore page.</p>
            <a href="index.html">
                Back to recipes
            </a>
        </div>
    `;
}

/*
=====================================================
DISPLAY RECIPE
=====================================================
*/

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

    /*
    -----------------------------------------------
    IMAGE
    -----------------------------------------------
    */

    if (recipeImage) {

        recipeImage.src =
            getImageUrl(
                recipe.image
            );

        recipeImage.alt =
            recipe.title ||
            "Recipe";

        recipeImage.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "images/placeholder.jpg";

            };

    }

    /*
    -----------------------------------------------
    TITLE
    -----------------------------------------------
    */

    if (recipeTitle) {

        recipeTitle.textContent =
            recipe.title ||
            "Untitled Recipe";

    }

    /*
    -----------------------------------------------
    AUTHOR
    -----------------------------------------------
    */

    if (recipeAuthor) {

        recipeAuthor.textContent =
            "By " +
            (
                recipe.author ||
                "Recipe App"
            );

    }

    /*
    -----------------------------------------------
    TIME
    -----------------------------------------------
    */

    if (recipeTime) {

        recipeTime.textContent =
            recipe.time
                ? recipe.time
                : "-";

    }

    /*
    -----------------------------------------------
    SERVINGS
    -----------------------------------------------
    */

    if (recipeServings) {

        recipeServings.textContent =
            recipe.servings ||
            "-";

    }

    /*
    -----------------------------------------------
    DIFFICULTY
    -----------------------------------------------
    */

    if (recipeDifficulty) {

        recipeDifficulty.textContent =
            recipe.difficulty ||
            "-";

    }

    /*
    -----------------------------------------------
    DESCRIPTION
    -----------------------------------------------
    */

    if (recipeDescription) {

        recipeDescription.textContent =
            recipe.description ||
            "No description available.";

    }

    /*
    -----------------------------------------------
    INGREDIENTS
    -----------------------------------------------
    */

    const ingredientsList =
        document.getElementById(
            "ingredientsList"
        );

    if (ingredientsList) {

        ingredientsList.innerHTML = "";

        if (
            Array.isArray(
                recipe.ingredients
            ) &&
            recipe.ingredients.length > 0
        ) {

            recipe.ingredients.forEach(
                function (item) {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent = item;

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

    /*
    -----------------------------------------------
    INSTRUCTIONS
    -----------------------------------------------
    */

    const instructionsList =
        document.getElementById(
            "instructionsList"
        );

    if (instructionsList) {

        instructionsList.innerHTML = "";

        if (
            Array.isArray(
                recipe.instructions
            ) &&
            recipe.instructions.length > 0
        ) {

            recipe.instructions.forEach(
                function (step) {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent = step;

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

    /*
    -----------------------------------------------
    NUTRITION
    -----------------------------------------------
    */

    const nutritionList =
        document.getElementById(
            "nutritionList"
        );

    if (nutritionList) {

        nutritionList.innerHTML = `
            <li>
                Calories: ${recipe.calories ?? 0} kcal
            </li>

            <li>
                Protein: ${recipe.protein ?? 0} g
            </li>

            <li>
                Carbs: ${recipe.carbs ?? 0} g
            </li>

            <li>
                Fat: ${recipe.fat ?? 0} g
            </li>
        `;

    }

}

/*
=====================================================
LOAD RECIPE
=====================================================
*/

async function loadRecipe() {

    if (
        !Number.isInteger(recipeId) ||
        recipeId <= 0
    ) {

        showRecipeError(
            "Invalid recipe ID."
        );

        return;
    }

    console.log(
        "Loading recipe ID:",
        recipeId
    );

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/recipes/${recipeId}`
            );

        console.log(
            "Recipe response status:",
            response.status
        );

        const text =
            await response.text();

        console.log(
            "Recipe response:",
            text
        );

        let data;

        try {

            data =
                JSON.parse(text);

        } catch (parseError) {

            console.error(
                "Invalid JSON returned by server:",
                text
            );

            throw new Error(
                "Server returned invalid data."
            );

        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Recipe not found."
            );

        }

        recipe = data;

        displayRecipe(recipe);

        await loadFavouriteStatus();

    } catch (error) {

        console.error(
            "Load recipe error:",
            error
        );

        showRecipeError(
            error.message ||
            "Could not load recipe."
        );

    }

}

/*
=====================================================
LOAD FAVOURITE STATUS
=====================================================
*/

async function loadFavouriteStatus() {

    const heart =
        document.getElementById(
            "heart"
        );

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
                `${API_BASE_URL}/api/favourites/${userId}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            updateHeart(false);

            return;
        }

        const favourites =
            Array.isArray(data)
                ? data
                : [];

        const isFavourite =
            favourites.some(
                function (item) {

                    return (
                        Number(
                            item.id ||
                            item.recipe_id ||
                            item.recipeId
                        ) ===
                        Number(recipeId)
                    );

                }
            );

        updateHeart(
            isFavourite
        );

    } catch (error) {

        console.error(
            "Favourite status error:",
            error
        );

        updateHeart(false);

    }

}

/*
=====================================================
UPDATE HEART
=====================================================
*/

function updateHeart(isFavourite) {

    const heart =
        document.getElementById(
            "heart"
        );

    if (!heart) {
        return;
    }

    if (isFavourite) {

        heart.src =
            "images/icons/HeartFilled.png";

        heart.alt =
            "Remove from favourites";

    } else {

        heart.src =
            "images/icons/HeartUnfilled.png";

        heart.alt =
            "Add to favourites";

    }

}

/*
=====================================================
TOGGLE FAVOURITE
=====================================================
*/

async function toggleFavourite() {

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

        const getResponse =
            await fetch(
                `${API_BASE_URL}/api/favourites/${userId}`
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
            Array.isArray(favourites) &&
            favourites.some(
                function (item) {

                    return (
                        Number(
                            item.id ||
                            item.recipe_id ||
                            item.recipeId
                        ) ===
                        Number(recipe.id)
                    );

                }
            );

        if (alreadyFavourite) {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/favourites`,
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

            const response =
                await fetch(
                    `${API_BASE_URL}/api/favourites`,
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

/*
=====================================================
HEART CLICK
=====================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const heart =
            document.getElementById(
                "heart"
            );

        if (heart) {

            heart.addEventListener(
                "click",
                toggleFavourite
            );

        }

        loadRecipe();

    }
);