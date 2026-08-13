const recipeContainer =
    document.getElementById("recipeContainer");

const searchInput =
    document.getElementById("searchInput");


/*
====================================================
RECIPE DATA
====================================================
All recipes are loaded from the backend database.
====================================================
*/

let allRecipes = [];


/*
====================================================
GET RECIPE IMAGE URL
====================================================
*/

function getRecipeImageUrl(image) {

    if (!image) {
        return "images/placeholder.jpg";
    }

    const cleanImage =
        String(image).trim();

    if (!cleanImage) {
        return "images/placeholder.jpg";
    }


    /*
    --------------------------------------------
    Complete URL
    --------------------------------------------
    */

    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {
        return cleanImage;
    }


    /*
    --------------------------------------------
    Client-side image
    --------------------------------------------
    Example:
    images/recipes/AvocadoBread.jpg
    --------------------------------------------
    */

    if (
        cleanImage.startsWith("images/")
    ) {
        return cleanImage;
    }


    /*
    --------------------------------------------
    Uploaded backend image
    --------------------------------------------
    */

    return (
        "http://localhost:3000/uploads/" +
        cleanImage
    );
}


/*
====================================================
ESCAPE HTML
====================================================
Prevents recipe text from being interpreted
as HTML.
====================================================
*/

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/*
====================================================
DISPLAY LOADING
====================================================
*/

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


/*
====================================================
DISPLAY ERROR
====================================================
*/

function displayError(message) {

    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = `
        <div class="error-message">

            <h3>
                Unable to load recipes
            </h3>

            <p>
                ${escapeHtml(message)}
            </p>

            <button
                type="button"
                onclick="loadRecipes()"
            >
                Try Again
            </button>

        </div>
    `;
}


/*
====================================================
DISPLAY EMPTY
====================================================
*/

function displayEmpty(
    message = "No recipes found."
) {

    if (!recipeContainer) {
        return;
    }

    recipeContainer.innerHTML = `
        <div class="empty-message">
            <p>
                ${escapeHtml(message)}
            </p>
        </div>
    `;
}


/*
====================================================
DISPLAY RECIPES
====================================================
*/

function displayRecipes(recipeList) {

    if (!recipeContainer) {
        return;
    }


    recipeContainer.innerHTML = "";


    /*
    --------------------------------------------
    No recipes
    --------------------------------------------
    */

    if (
        !Array.isArray(recipeList) ||
        recipeList.length === 0
    ) {

        displayEmpty(
            "No recipes found."
        );

        return;
    }


    /*
    --------------------------------------------
    Display every recipe
    --------------------------------------------
    */

    recipeList.forEach(
        function (recipe) {

            /*
            ------------------------------------
            Image
            ------------------------------------
            */

            const imageUrl =
                getRecipeImageUrl(
                    recipe.image
                );


            /*
            ------------------------------------
            Title
            ------------------------------------
            */

            const title =
                escapeHtml(
                    recipe.title ||
                    "Untitled Recipe"
                );


            /*
            ------------------------------------
            Description
            ------------------------------------
            */

            const description =
                escapeHtml(
                    recipe.description ||
                    ""
                );


            /*
            ------------------------------------
            Time
            ------------------------------------
            */

            const time =
                escapeHtml(
                    recipe.time ||
                    "N/A"
                );


            /*
            ------------------------------------
            Difficulty
            ------------------------------------
            */

            const difficulty =
                escapeHtml(
                    recipe.difficulty ||
                    "Easy"
                );


            /*
            ------------------------------------
            Author

            IMPORTANT:
            Backend returns "author",
            not "user.name".
            ------------------------------------
            */

            const author =
                escapeHtml(
                    recipe.author ||
                    "Recipe App"
                );


            /*
            ------------------------------------
            Recipe card
            ------------------------------------
            */

            recipeContainer.innerHTML += `

                <div class="recipe-card">

                    <a
                        href="recipe.html?id=${Number(recipe.id)}"
                    >

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
        }
    );
}


/*
====================================================
LOAD RECIPES FROM BACKEND
====================================================
*/

async function loadRecipes() {

    if (!recipeContainer) {
        return;
    }


    displayLoading();


    try {

        /*
        --------------------------------------------
        getAllRecipes()
        should be your API helper function.
        --------------------------------------------
        */

        const response =
            await getAllRecipes();


        /*
        --------------------------------------------
        Check API response
        --------------------------------------------
        */

        if (!response.ok) {

            const message =
                response.data &&
                response.data.message
                    ? response.data.message
                    : "Could not load recipes.";

            displayError(message);

            return;
        }


        /*
        --------------------------------------------
        Make sure server returned an array
        --------------------------------------------
        */

        if (
            !Array.isArray(
                response.data
            )
        ) {

            console.error(
                "Invalid recipe response:",
                response.data
            );

            displayError(
                "The server returned an invalid recipe list."
            );

            return;
        }


        /*
        --------------------------------------------
        Save API recipes
        --------------------------------------------
        */

        allRecipes =
            response.data;


        console.log(
            "Recipes loaded from database:",
            allRecipes
        );


        /*
        --------------------------------------------
        Display recipes
        --------------------------------------------
        */

        displayRecipes(
            allRecipes
        );

    } catch (error) {

        console.error(
            "Load recipes error:",
            error
        );


        displayError(
            "Could not connect to the server. Please make sure the backend is running."
        );
    }
}


/*
====================================================
SEARCH RECIPES
====================================================
*/

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();


            /*
            ----------------------------------------
            Empty search
            ----------------------------------------
            */

            if (
                keyword === ""
            ) {

                displayRecipes(
                    allRecipes
                );

                return;
            }


            /*
            ----------------------------------------
            Search title, description and category
            ----------------------------------------
            */

            const filteredRecipes =
                allRecipes.filter(
                    function (recipe) {

                        const title =
                            String(
                                recipe.title ||
                                ""
                            ).toLowerCase();


                        const description =
                            String(
                                recipe.description ||
                                ""
                            ).toLowerCase();


                        const category =
                            String(
                                recipe.category ||
                                ""
                            ).toLowerCase();


                        return (
                            title.includes(
                                keyword
                            ) ||

                            description.includes(
                                keyword
                            ) ||

                            category.includes(
                                keyword
                            )
                        );
                    }
                );


            /*
            ----------------------------------------
            Nothing found
            ----------------------------------------
            */

            if (
                filteredRecipes.length === 0
            ) {

                displayEmpty(
                    `No recipes found for "${keyword}".`
                );

                return;
            }


            /*
            ----------------------------------------
            Display search results
            ----------------------------------------
            */

            displayRecipes(
                filteredRecipes
            );
        }
    );
}


/*
====================================================
INITIAL LOAD
====================================================
*/

loadRecipes();