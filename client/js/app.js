const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");

let allRecipes = [];

function getRecipeImageUrl(image) {
    if (!image) {
        return "images/placeholder.jpg";
    }

    const cleanImage = String(image).trim();

    if (!cleanImage) {
        return "images/placeholder.jpg";
    }

    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {
        return cleanImage;
    }

    if (cleanImage.startsWith("images/")) {
        return cleanImage;
    }

    if (cleanImage.startsWith("/images/")) {
        return "http://localhost:3000" + cleanImage;
    }

    if (cleanImage.startsWith("uploads/")) {
        return "http://localhost:3000/" + cleanImage;
    }

    if (cleanImage.startsWith("/uploads/")) {
        return "http://localhost:3000" + cleanImage;
    }

    return (
        "http://localhost:3000/uploads/" +
        encodeURIComponent(cleanImage)
    );
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function displayLoading() {
    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = `
        <div class="loading-message">
            <p>Loading recipes...</p>
        </div>
    `;
}

function displayError(message) {
    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = `
        <div class="error-message">
            <h3>Unable to load recipes</h3>
            <p>${escapeHtml(message)}</p>
            <button type="button" onclick="loadRecipes()">
                Try Again
            </button>
        </div>
    `;
}

function displayEmpty(message) {
    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = `
        <div class="empty-message">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

function displayRecipes(recipeList) {
    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = "";

    if (!Array.isArray(recipeList) || recipeList.length === 0) {
        displayEmpty("No recipes found.");
        return;
    }

    recipeList.forEach(function (recipe) {

        const imageUrl =
            getRecipeImageUrl(recipe.image);

        const title =
            escapeHtml(
                recipe.title || "Untitled Recipe"
            );

        const description =
            escapeHtml(
                recipe.description || ""
            );

        const time =
            escapeHtml(
                recipe.time || "N/A"
            );

        const difficulty =
            escapeHtml(
                recipe.difficulty || "Easy"
            );

        const author =
            escapeHtml(
                recipe.author || "Recipe App"
            );

        recipeContainer.innerHTML += `
            <div class="recipe-card">

                <a href="recipe.html?id=${Number(recipe.id)}">

                    <img
                        src="${imageUrl}"
                        class="recipe-image"
                        alt="${title}"
                        onerror="
                            this.onerror=null;
                            this.src='images/placeholder.jpg';
                        "
                    >

                </a>

                <div class="recipe-content">

                    <h3 class="recipe-title">
                        ${title}
                    </h3>

                    <p class="recipe-author">
                        By ${author}
                    </p>

                    ${
                        description
                            ? `
                                <p class="recipe-description">
                                    ${description}
                                </p>
                            `
                            : ""
                    }

                    <div class="recipe-footer">

                        <span class="time">
                            ${time}
                        </span>

                        <span class="difficulty">
                            ${difficulty}
                        </span>

                    </div>

                </div>

            </div>
        `;
    });
}

async function loadRecipes() {

    if (!recipeContainer) {
        return;
    }

    displayLoading();

    try {

        const recipes =
            await getRecipes();

        if (!Array.isArray(recipes)) {

            console.error(
                "Invalid recipe response:",
                recipes
            );

            displayError(
                "The server returned an invalid recipe list."
            );

            return;
        }

        allRecipes = recipes;

        displayRecipes(allRecipes);

    } catch (error) {

        console.error(
            "Load recipes error:",
            error
        );

        displayError(
            error.message ||
            "Could not connect to the server."
        );
    }
}

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();

            if (!keyword) {
                displayRecipes(allRecipes);
                return;
            }

            const filteredRecipes =
                allRecipes.filter(
                    function (recipe) {

                        const title =
                            String(
                                recipe.title || ""
                            ).toLowerCase();

                        const description =
                            String(
                                recipe.description || ""
                            ).toLowerCase();

                        const category =
                            String(
                                recipe.category || ""
                            ).toLowerCase();

                        return (
                            title.includes(keyword) ||
                            description.includes(keyword) ||
                            category.includes(keyword)
                        );
                    }
                );

            if (filteredRecipes.length === 0) {

                displayEmpty(
                    `No recipes found for "${keyword}".`
                );

                return;
            }

            displayRecipes(filteredRecipes);
        }
    );
}

loadRecipes();