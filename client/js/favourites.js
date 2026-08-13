document.addEventListener("DOMContentLoaded", function () {

    const favouriteGrid = document.getElementById("favouriteGrid");
    const searchInput = document.getElementById("searchFavourite");

    let favouriteRecipes = [];


    // =====================================================
    // LOGIN CHECK
    // =====================================================

    if (!isLoggedIn()) {

        if (favouriteGrid) {
            favouriteGrid.innerHTML = `
                <div class="empty-state">
                    <h2>Please log in first.</h2>
                    <a href="login.html">Login</a>
                </div>
            `;
        }

        return;
    }


    // =====================================================
    // GET TOKEN
    // =====================================================

    function getToken() {

        const possibleKeys = [
            "token",
            "authToken",
            "accessToken",
            "jwt"
        ];

        for (const key of possibleKeys) {

            const value = localStorage.getItem(key);

            if (value) {
                return value;
            }
        }

        return null;
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =====================================================
    // IMAGE URL
    // =====================================================

    function getImageUrl(image) {

        if (!image) {
            return "images/placeholder.jpg";
        }

        const cleanImage = String(image).trim();

        if (!cleanImage) {
            return "images/placeholder.jpg";
        }


        // Already a complete URL
        if (
            cleanImage.startsWith("http://") ||
            cleanImage.startsWith("https://")
        ) {
            return cleanImage;
        }


        // Local client image
        if (
            cleanImage.startsWith("images/") ||
            cleanImage.startsWith("./images/")
        ) {
            return cleanImage;
        }


        if (cleanImage.startsWith("/images/")) {
            return "http://localhost:3000" + cleanImage;
        }


        // Server uploads folder
        if (cleanImage.startsWith("uploads/")) {
            return "http://localhost:3000/" + cleanImage;
        }


        if (cleanImage.startsWith("/uploads/")) {
            return "http://localhost:3000" + cleanImage;
        }


        // Just a filename
        return (
            "http://localhost:3000/uploads/" +
            encodeURIComponent(cleanImage)
        );
    }


    // =====================================================
    // DISPLAY FAVOURITES
    // =====================================================

    function displayRecipes(list) {

        if (!favouriteGrid) {
            return;
        }

        favouriteGrid.innerHTML = "";


        // No favourites
        if (
            !Array.isArray(list) ||
            list.length === 0
        ) {

            favouriteGrid.innerHTML = `
                <div class="empty-state">
                    <h2>No favourites yet.</h2>
                    <p>Save recipes you love and they will appear here.</p>
                    <a href="index.html">Explore Recipes</a>
                </div>
            `;

            return;
        }


        list.forEach(function (recipe) {

            const recipeId = Number(recipe.id);

            if (
                !Number.isInteger(recipeId) ||
                recipeId <= 0
            ) {
                return;
            }


            const title = escapeHtml(
                recipe.title || "Untitled Recipe"
            );

            const time = escapeHtml(
                recipe.time || "N/A"
            );

            const difficulty = escapeHtml(
                recipe.difficulty || "Easy"
            );

            const category = escapeHtml(
                recipe.category || ""
            );

            const image = getImageUrl(recipe.image);


            favouriteGrid.innerHTML += `
                <div class="recipe-card">

                    <a href="recipe.html?id=${recipeId}">
                        <img
                            src="${image}"
                            class="recipe-image"
                            alt="${title}"
                            onerror="
                                this.onerror=null;
                                this.src='images/placeholder.jpg';
                            "
                        >
                    </a>

                    <div class="recipe-content">

                        <h3>${title}</h3>

                        <p>${time}</p>

                        <p>${difficulty}</p>

                        ${
                            category
                                ? `<p>${category}</p>`
                                : ""
                        }

                        <div class="buttons">

                            <button
                                type="button"
                                class="view-btn"
                                onclick="viewFavouriteRecipe(${recipeId})"
                            >
                                View
                            </button>

                            <button
                                type="button"
                                class="remove-btn"
                                onclick="removeFavouriteRecipe(${recipeId})"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>
            `;
        });
    }


    // =====================================================
    // LOAD FAVOURITES
    // =====================================================

    async function loadFavourites() {

        if (!favouriteGrid) {
            return;
        }

        const token = getToken();

        if (!token) {

            favouriteGrid.innerHTML = `
                <div class="empty-state">
                    <h2>Your session has expired.</h2>
                    <a href="login.html">Login again</a>
                </div>
            `;

            return;
        }


        favouriteGrid.innerHTML = `
            <div class="loading-message">
                Loading your favourites...
            </div>
        `;


        try {

            const response = await fetch(
                "http://localhost:3000/api/favourites",
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );


            let data = {};

            try {
                data = await response.json();
            } catch (jsonError) {
                data = {};
            }


            // Authentication failure
            if (
                response.status === 401 ||
                response.status === 403
            ) {

                favouriteGrid.innerHTML = `
                    <div class="empty-state">
                        <h2>Your session has expired.</h2>
                        <a href="login.html">Login again</a>
                    </div>
                `;

                return;
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not load favourites."
                );
            }


            if (Array.isArray(data)) {
                favouriteRecipes = data;
            } else {
                favouriteRecipes = [];
            }


            displayRecipes(favouriteRecipes);

        } catch (error) {

            console.error(
                "Load favourites error:",
                error
            );

            favouriteGrid.innerHTML = `
                <div class="empty-state">

                    <h2>Could not load favourites.</h2>

                    <p>
                        ${escapeHtml(
                            error.message ||
                            "Please try again."
                        )}
                    </p>

                    <button
                        type="button"
                        onclick="loadFavouriteRecipesAgain()"
                    >
                        Try Again
                    </button>

                </div>
            `;
        }
    }


    // =====================================================
    // VIEW RECIPE
    // =====================================================

    window.viewFavouriteRecipe = function (id) {

        const recipeId = Number(id);

        if (
            !Number.isInteger(recipeId) ||
            recipeId <= 0
        ) {
            alert("Invalid recipe.");
            return;
        }

        window.location.href =
            "recipe.html?id=" + recipeId;
    };


    // =====================================================
    // REMOVE FAVOURITE
    // =====================================================

    window.removeFavouriteRecipe = async function (id) {

        const recipeId = Number(id);

        if (
            !Number.isInteger(recipeId) ||
            recipeId <= 0
        ) {
            alert("Invalid recipe.");
            return;
        }


        const recipe =
            favouriteRecipes.find(function (item) {

                return Number(item.id) === recipeId;

            });


        const recipeTitle =
            recipe && recipe.title
                ? recipe.title
                : "this recipe";


        const confirmed = confirm(
            'Remove "' +
            recipeTitle +
            '" from your favourites?'
        );


        if (!confirmed) {
            return;
        }


        const token = getToken();

        if (!token) {

            alert(
                "Your session has expired. Please login again."
            );

            window.location.href = "login.html";

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:3000/api/favourites/" +
                recipeId,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );


            let data = {};

            try {
                data = await response.json();
            } catch (jsonError) {
                data = {};
            }


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                alert(
                    data.message ||
                    "You are not authorized to remove this favourite."
                );

                return;
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not remove favourite."
                );
            }


            // Remove it from the local list
            favouriteRecipes =
                favouriteRecipes.filter(
                    function (recipe) {

                        return Number(recipe.id) !== recipeId;

                    }
                );


            // Redisplay
            displayRecipes(favouriteRecipes);


            // Show success message
            alert(
                data.message ||
                "Recipe removed from favourites."
            );


        } catch (error) {

            console.error(
                "Remove favourite error:",
                error
            );

            alert(
                error.message ||
                "Could not remove favourite."
            );
        }
    };


    // =====================================================
    // SEARCH FAVOURITES
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const keyword =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                if (!keyword) {

                    displayRecipes(
                        favouriteRecipes
                    );

                    return;
                }


                const filtered =
                    favouriteRecipes.filter(
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


                displayRecipes(filtered);
            }
        );
    }


    // =====================================================
    // TRY AGAIN
    // =====================================================

    window.loadFavouriteRecipesAgain =
        function () {

            loadFavourites();

        };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadFavourites();

});