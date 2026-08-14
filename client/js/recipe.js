document.addEventListener("DOMContentLoaded", function () {
    const params =new URLSearchParams(window.location.search);
    const recipeId =Number(params.get("id"));
    let recipe = null;
    function getImageUrl(image) {
        if (!image) {
            return "images/placeholder.jpg";
        }
        const clean =String(image).trim();
        if (!clean) {
            return "images/placeholder.jpg";
        }
        if (clean.startsWith("http://") || clean.startsWith("https://")) {
            return clean;
        }
        if (clean.startsWith("images/")) {
            return clean;
        }
        if (clean.startsWith("/images/")) {
            return ("http://localhost:3000" +clean);
        }
        if (clean.startsWith("uploads/")) {
            return ("http://localhost:3000/" +clean);
        }
        if (clean.startsWith("/uploads/")) {
            return ("http://localhost:3000" +clean);
        }
        return ("http://localhost:3000/uploads/" + encodeURIComponent(clean));
    }
    function showError(message) {
        const page =document.querySelector(".recipe-page");
        if (!page) {
            return;
        }
        page.innerHTML =
            "<div class='empty-state'>" +
            "<h2>" +message +"</h2>" +
            "<p>Please return to the Explore page.</p>" +
            "<a href='index.html'>Back to recipes</a>" +
            "</div>";
    }

    function displayRecipe(data) {
        const image =document.getElementById("recipeImage");
        const title =document.getElementById("recipeTitle");
        const author =document.getElementById("recipeAuthor");
        const time =document.getElementById("recipeTime");
        const servings =document.getElementById("recipeServings");
        const difficulty =document.getElementById("recipeDifficulty");
        const description =document.getElementById("recipeDescription");
        if (image) {
            image.src =getImageUrl(data.image);
            image.alt =data.title || "Recipe";
            image.onerror =function () {
                this.onerror = null;
                this.src ="images/placeholder.jpg";
            };
        }
        if (title) {
            title.textContent =data.title || "Untitled Recipe";
        }
        if (author) {
            author.textContent ="By " +(data.author || "Recipe App");
        }
        if (time) {
            time.textContent =data.time + "mins" || "-";
        }
        if (servings) {
            servings.textContent =data.servings || "-";
        }
        if (difficulty) {
            difficulty.textContent =data.difficulty || "-";
        }
        if (description) {
            description.textContent =data.description || "No description available.";
        }

        /* INGREDIENTS */
        const ingredientsList =document.getElementById("ingredientsList");
        if (ingredientsList) {
            ingredientsList.innerHTML = "";
            if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
                data.ingredients.forEach(function (ingredient) {
                    const li =document.createElement("li");
                    li.textContent =ingredient;
                    ingredientsList.appendChild(li);
                });
            } else {
                ingredientsList.innerHTML ="<li>No ingredients listed.</li>";
            }
        }

        /* INSTRUCTIONS */
        const instructionsList =document.getElementById("instructionsList");
        if (instructionsList) {
            instructionsList.innerHTML = "";
            if (Array.isArray(data.instructions) && data.instructions.length > 0) {
                data.instructions.forEach(function (instruction) {
                    const li = document.createElement("li");
                    li.textContent =instruction;
                    instructionsList.appendChild(li);
                });
            } else {
                instructionsList.innerHTML ="<li>No instructions listed.</li>";
            }
        }

        /* NUTRITION */
        const nutritionList =document.getElementById("nutritionList");
        if (nutritionList) {
            nutritionList.innerHTML =
                "<li>Calories: " +(data.calories ?? 0) +" kcal</li>" +
                "<li>Protein: " +(data.protein ?? 0) +" g</li>" +
                "<li>Carbs: " +(data.carbs ?? 0) +" g</li>" +
                "<li>Fat: " +(data.fat ?? 0) +" g</li>";
        }
    }

    async function loadFavouriteStatus() {
        const heart =document.getElementById("heart");
        if (!heart) {
            return;
        }
        if (!isLoggedIn()) {
            updateHeart(false);
            return;
        }
        try {
            const favourites =await getFavourites();
            const isFavourite =Array.isArray(favourites) && favourites.some(function (item) {
                return Number(item.id) === Number(recipeId);
            });
            updateHeart(isFavourite);
        } catch (error) {
            console.error("Favourite status error:",error);
            updateHeart(false);
        }
    }

    function updateHeart(isFavourite) {
        const heart =document.getElementById("heart");
        if (!heart) {
            return;
        }
        if (isFavourite) {
            heart.src ="images/icons/HeartFilled.png";
            heart.alt ="Remove from favourites";
        } else {
            heart.src ="images/icons/HeartUnfilled.png";
            heart.alt ="Add to favourites";
        }
    }

    async function toggleFavourite() {
        if (!isLoggedIn()) {
            alert("Please log in first.");
            window.location.href ="login.html";
            return;
        }
        if (!recipe) {
            return;
        }
        try {
            const favourites =await getFavourites();
            const alreadyFavourite =Array.isArray(favourites) && favourites.some(function (item) {
                return Number(item.id) === Number(recipe.id);
            });
            if (alreadyFavourite) {
                await removeFavourite(recipe.id);
                updateHeart(false);
            } else {
                await addFavourite(recipe.id);
                updateHeart(true);
            }
        } catch (error) {
            console.error("Favourite error:",error);
            alert(error.message || "Could not update favourite.");
        }
    }

    async function loadRecipe() {
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            showError("Invalid recipe ID.");
            return;
        }
        try {
            recipe =await getRecipe(recipeId);
            displayRecipe(recipe);
            await loadFavouriteStatus();
        } catch (error) {
            console.error("Load recipe error:",error);
            showError(error.message || "Could not load recipe.");
        }
    }

    const heart =document.getElementById("heart");
    if (heart) {
        heart.addEventListener("click",toggleFavourite);
    }
    loadRecipe();
});