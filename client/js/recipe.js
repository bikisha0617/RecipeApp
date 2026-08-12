const params = new URLSearchParams(
    window.location.search
);

const recipeId = Number(
    params.get("id")
);

const userId = localStorage.getItem("userId");


// Load selected recipe
async function loadRecipe() {

    try {

        const response = await fetch(
            `http://localhost:3000/api/recipes/${recipeId}`
        );

        const recipe = await response.json();

        if (!response.ok) {

            document.querySelector(".recipe-page").innerHTML = `
                <h2>${recipe.message || "Recipe not found."}</h2>
            `;

            return;
        }

        displayRecipe(recipe);

    } catch (error) {

        console.error("Load recipe error:", error);

        document.querySelector(".recipe-page").innerHTML = `
            <h2>Could not connect to server.</h2>
        `;

    }

}


// Display recipe
function displayRecipe(recipe) {

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

    if (
        recipe.ingredients &&
        recipe.ingredients.length > 0
    ) {

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

    if (
        recipe.instructions &&
        recipe.instructions.length > 0
    ) {

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

    if (recipe.calories !== null) {

        nutritionList.innerHTML = `
            <li>
                Calories: ${recipe.calories || "-"} kcal
            </li>

            <li>
                Protein: ${recipe.protein || "-"} g
            </li>

            <li>
                Carbs: ${recipe.carbs || "-"} g
            </li>

            <li>
                Fat: ${recipe.fat || "-"} g
            </li>
        `;

    }


    // Favourite heart
    const heart =
        document.getElementById("heart");

    if (!heart) {
        return;
    }

    updateHeart(recipe.id);


    heart.onclick = async function () {

        if (!userId) {

            alert("Please log in to favourite recipes.");

            window.location.href = "login.html";

            return;
        }

        try {

            const favourites =
                JSON.parse(
                    localStorage.getItem("favourites")
                ) || [];

            const isFavourite =
                favourites.includes(recipe.id);

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
                            recipe_id: recipe.id
                        })
                    }
                );

            } else {

                response = await fetch(
                    `http://localhost:3000/api/favourites/${userId}/${recipe.id}`,
                    {
                        method: "DELETE"
                    }
                );

            }

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not update favourite."
                );

                return;
            }


            // Update local state
            let updatedFavourites =
                JSON.parse(
                    localStorage.getItem("favourites")
                ) || [];


            if (!isFavourite) {

                updatedFavourites.push(recipe.id);

            } else {

                updatedFavourites =
                    updatedFavourites.filter(
                        id => id !== recipe.id
                    );

            }


            localStorage.setItem(
                "favourites",
                JSON.stringify(updatedFavourites)
            );


            updateHeart(recipe.id);

        } catch (error) {

            console.error(
                "Favourite error:",
                error
            );

            alert(
                "Could not connect to server."
            );

        }

    };

}


// Update heart
function updateHeart(recipeId) {

    const heart =
        document.getElementById("heart");

    if (!heart) {
        return;
    }

    const favourites =
        JSON.parse(
            localStorage.getItem("favourites")
        ) || [];


    if (favourites.includes(recipeId)) {

        heart.src =
            "images/icons/HeartFilled.png";

    } else {

        heart.src =
            "images/icons/HeartUnfilled.png";

    }

}


// Start
loadRecipe();