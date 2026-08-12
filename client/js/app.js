const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];


/* =========================
   RECIPES
========================= */

function displayRecipes(recipeList) {

    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = "";

    recipeList.forEach(function (recipe) {

        const isFavourite = favourites.includes(recipe.id);

        recipeContainer.innerHTML += `
            <div class="recipe-card">

                <a href="recipe.html?id=${recipe.id}">
                    <img
                        src="${recipe.image}"
                        class="recipe-image"
                        alt="${recipe.title}"
                    >
                </a>

                <div class="recipe-content">

                    <h3 class="recipe-title">
                        ${recipe.title}
                    </h3>

                    <p class="recipe-author">
                        By ${recipe.author}
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
                            alt="Favourite"
                        >

                    </div>

                </div>

            </div>
        `;
    });
}


/* =========================
   DISPLAY DEFAULT RECIPES
========================= */

if (typeof recipes !== "undefined") {
    displayRecipes(recipes);
}


/* =========================
   SEARCH
========================= */

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword = searchInput.value.toLowerCase().trim();

        if (typeof recipes === "undefined") {
            return;
        }

        const filteredRecipes = recipes.filter(function (recipe) {

            return recipe.title
                .toLowerCase()
                .includes(keyword);

        });

        displayRecipes(filteredRecipes);
    });
}


/* =========================
   FAVOURITES
========================= */

function toggleFavourite(id) {

    const loggedIn =
        localStorage.getItem("loggedIn") === "true";

    const userId =
        localStorage.getItem("userId");

    if (!loggedIn || !userId) {

        alert("Please log in first.");

        window.location.href = "login.html";

        return;
    }

    const index = favourites.indexOf(id);

    if (index === -1) {

        favourites.push(id);

    } else {

        favourites.splice(index, 1);
    }

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    if (typeof recipes !== "undefined") {
        displayRecipes(recipes);
    }
}