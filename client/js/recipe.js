const params = new URLSearchParams(window.location.search);
const recipeId = Number(params.get("id"));

const recipePage = document.querySelector(".recipe-page");

// Get default recipe from data.js
const defaultRecipe = recipes.find(function (recipe) {
    return recipe.id === recipeId;
});


// Display recipe
function displayRecipe(recipe) {

    if (!recipe) {
        recipePage.innerHTML = `
            <h2>Recipe not found.</h2>
        `;
        return;
    }

    document.getElementById("recipeImage").src =
        recipe.image || "images/recipes/default.jpg";

    document.getElementById("recipeImage").alt =
        recipe.title;

    document.getElementById("recipeTitle").textContent =
        recipe.title;

    document.getElementById("recipeAuthor").textContent =
        "By " + (recipe.author || "Unknown");

    document.getElementById("recipeTime").textContent =
        recipe.time || "-";

    document.getElementById("recipeServings").textContent =
        recipe.servings || "-";

    document.getElementById("recipeDifficulty").textContent =
        recipe.difficulty || "-";

    document.getElementById("recipeDescription").textContent =
        recipe.description || "";


    // Ingredients
    const ingredientsList =
        document.getElementById("ingredientsList");

    ingredientsList.innerHTML = "";

    if (recipe.ingredients && recipe.ingredients.length > 0) {

        recipe.ingredients.forEach(function (item) {

            const li = document.createElement("li");

            li.textContent = item;

            ingredientsList.appendChild(li);

        });

    }


    // Instructions
    const instructionsList =
        document.getElementById("instructionsList");

    instructionsList.innerHTML = "";

    if (recipe.instructions && recipe.instructions.length > 0) {

        recipe.instructions.forEach(function (step) {

            const li = document.createElement("li");

            li.textContent = step;

            instructionsList.appendChild(li);

        });

    }


    // Nutrition
    const nutritionList =
        document.getElementById("nutritionList");

    nutritionList.innerHTML = "";

    if (recipe.nutrition) {

        const nutrition = recipe.nutrition;

        nutritionList.innerHTML = `
            <li>Calories: ${nutrition.calories || "-"} kcal</li>
            <li>Protein: ${nutrition.protein || "-"} g</li>
            <li>Carbs: ${nutrition.carbs || "-"} g</li>
            <li>Fat: ${nutrition.fat || "-"} g</li>
        `;

    } else {

        nutritionList.innerHTML = `
            <li>Calories: ${recipe.calories || "-"} kcal</li>
            <li>Protein: ${recipe.protein || "-"} g</li>
            <li>Carbs: ${recipe.carbs || "-"} g</li>
            <li>Fat: ${recipe.fat || "-"} g</li>
        `;

    }


    // Favourite button
    setupFavourite(recipe);

}


// Favourite
function setupFavourite(recipe) {

    const heart = document.getElementById("heart");

    if (!heart) {
        return;
    }

    const userId = localStorage.getItem("userId");

    // Default recipes use localStorage
    if (!recipe.user_id) {

        let favourites =
            JSON.parse(localStorage.getItem("favourites")) || [];

        function updateHeart() {

            if (favourites.includes(recipe.id)) {
                heart.src = "images/icons/HeartFilled.png";
            } else {
                heart.src = "images/icons/HeartUnfilled.png";
            }

        }

        updateHeart();

        heart.onclick = function () {

            const index = favourites.indexOf(recipe.id);

            if (index === -1) {
                favourites.push(recipe.id);
            } else {
                favourites.splice(index, 1);
            }

            localStorage.setItem(
                "favourites",
                JSON.stringify(favourites)
            );

            updateHeart();

        };

        return;
    }


    // User-created recipes use server
    if (!userId) {

        heart.onclick = function () {
            alert("Please login to favourite this recipe.");
        };

        return;
    }


    let isFavourite = false;


    async function checkFavourite() {

        try {

            const response = await fetch(
                `http://localhost:3000/api/favourites/${userId}`
            );

            const favouriteRecipes = await response.json();

            if (!response.ok) {
                return;
            }

            isFavourite = favouriteRecipes.some(function (item) {
                return item.id === recipe.id;
            });

            updateHeart();

        } catch (error) {

            console.error(error);

        }

    }


    function updateHeart() {

        if (isFavourite) {
            heart.src = "images/icons/HeartFilled.png";
        } else {
            heart.src = "images/icons/HeartUnfilled.png";
        }

    }


    heart.onclick = async function () {

        try {

            let response;

            if (isFavourite) {

                response = await fetch(
                    "http://localhost:3000/api/favourites",
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user_id: Number(userId),
                            recipe_id: recipe.id
                        })
                    }
                );

            } else {

                response = await fetch(
                    "http://localhost:3000/api/favourites",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user_id: Number(userId),
                            recipe_id: recipe.id
                        })
                    }
                );

            }

            if (!response.ok) {

                const data = await response.json();

                alert(
                    data.message ||
                    "Could not update favourite."
                );

                return;
            }

            isFavourite = !isFavourite;

            updateHeart();

        } catch (error) {

            console.error(error);

            alert("Could not connect to server.");

        }

    };


    checkFavourite();

}


// Default recipe
if (defaultRecipe) {

    displayRecipe(defaultRecipe);

}


// User-created recipe
else {

    async function loadRecipe() {

        try {

            const response = await fetch(
                `http://localhost:3000/api/recipes/${recipeId}`
            );

            const data = await response.json();

            if (!response.ok) {

                recipePage.innerHTML = `
                    <h2>${data.message || "Recipe not found."}</h2>
                `;

                return;
            }

            displayRecipe(data);

        } catch (error) {

            console.error(error);

            recipePage.innerHTML = `
                <h2>Could not connect to server.</h2>
            `;

        }

    }

    loadRecipe();

}