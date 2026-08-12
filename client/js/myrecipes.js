const recipeGrid =
    document.getElementById("myRecipeGrid");

const searchInput =
    document.getElementById("searchRecipe");

const userId =
    localStorage.getItem("userId");

let userRecipes = [];


// ===============================
// Login Check
// ===============================

if (!userId) {

    alert("Please login first.");

    window.location.href =
        "login.html";
}


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


    // Already a complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }


    // If database contains /uploads/filename
    if (image.includes("/uploads/")) {

        const filename =
            image.split("/uploads/").pop();

        return (
            "http://localhost:3000/uploads/" +
            filename
        );
    }


    // If database contains uploads/filename
    if (image.startsWith("uploads/")) {

        return (
            "http://localhost:3000/" +
            image
        );
    }


    // If database only contains filename
    return (
        "http://localhost:3000/uploads/" +
        image
    );
}


// ===============================
// Display Recipes
// ===============================

function displayRecipes(recipeList) {

    if (!recipeGrid) {
        return;
    }

    recipeGrid.innerHTML = "";


    if (
        !recipeList ||
        recipeList.length === 0
    ) {

        recipeGrid.innerHTML = `
            <p class="empty-message">
                You haven't created any recipes yet.
            </p>
        `;

        return;
    }


    recipeList.forEach(function (recipe) {

        const imageUrl =
            getImageUrl(recipe.image);


        recipeGrid.innerHTML += `
            <div class="recipe-box">

                <img
                    src="${imageUrl}"
                    alt="${recipe.title || "Recipe"}"
                    class="recipe-image"
                    onerror="this.onerror=null; this.src='images/placeholder.jpg';"
                >

                <div class="recipe-info">

                    <h3>
                        ${recipe.title || ""}
                    </h3>

                    <p>
                        ${recipe.time || "-"} mins
                    </p>

                    <div class="recipe-actions">

                        <button
                            type="button"
                            class="view-btn"
                            onclick="viewRecipe(${Number(recipe.id)})"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteRecipe(${Number(recipe.id)})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


// ===============================
// Load Recipes
// ===============================

async function loadRecipes() {

    if (!userId) {
        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:3000/api/recipes/user/${userId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not load recipes."
            );

            return;
        }


        userRecipes =
            Array.isArray(data)
                ? data
                : [];


        displayRecipes(userRecipes);


    } catch (error) {

        console.error(
            "Load recipes error:",
            error
        );

        alert(
            "Could not connect to the server."
        );
    }
}


// ===============================
// Search
// ===============================

if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                userRecipes.filter(
                    function (recipe) {

                        return (
                            recipe.title &&
                            recipe.title
                                .toLowerCase()
                                .includes(keyword)
                        );
                    }
                );


            displayRecipes(filtered);
        }
    );
}


// ===============================
// View Recipe
// ===============================

function viewRecipe(id) {

    window.location.href =
        `recipe.html?id=${Number(id)}`;
}


// ===============================
// Delete Recipe
// ===============================

async function deleteRecipe(id) {

    const confirmed =
        confirm("Delete this recipe?");


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/recipes/${Number(id)}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not delete recipe."
            );

            return;
        }


        alert(
            "Recipe deleted."
        );


        await loadRecipes();


    } catch (error) {

        console.error(
            "Delete recipe error:",
            error
        );

        alert(
            "Could not connect to the server."
        );
    }
}


// ===============================
// Initial Load
// ===============================

loadRecipes();