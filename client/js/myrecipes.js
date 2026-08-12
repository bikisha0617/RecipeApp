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
// Fix Image URL
// ===============================

function getImageUrl(image) {

    if (!image) {
        return "images/placeholder.jpg";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    if (image.startsWith("/uploads/")) {

        return "http://localhost:3000" + image;
    }

    if (image.startsWith("uploads/")) {

        return "http://localhost:3000/" + image;
    }

    return "http://localhost:3000/uploads/" + image;
}


// ===============================
// Display Recipes
// ===============================

function displayRecipes(recipeList) {

    recipeGrid.innerHTML = "";

    if (recipeList.length === 0) {

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
                    alt="${recipe.title}"
                    onerror="this.src='images/placeholder.jpg'"
                >

                <div class="recipe-info">

                    <h3>
                        ${recipe.title}
                    </h3>

                    <p>
                        ${recipe.time} mins
                    </p>

                    <div class="recipe-actions">

                        <button
                            class="view-btn"
                            onclick="viewRecipe(${recipe.id})"
                        >
                            View
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteRecipe(${recipe.id})"
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

    try {

        const response = await fetch(
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


        userRecipes = data;

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

                        return recipe.title
                            .toLowerCase()
                            .includes(keyword);
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
        `recipe.html?id=${id}`;
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
                `http://localhost:3000/api/recipes/${id}`,
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


        loadRecipes();


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