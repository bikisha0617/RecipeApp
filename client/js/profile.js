const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const recipeGrid = document.getElementById("profileRecipeGrid");
const savedGrid = document.getElementById("savedGrid");
const userId = localStorage.getItem("userId");

// CHECK LOGIN
if (!userId) {
    profileName.textContent = "Guest User";
    profileEmail.textContent = "Please log in";
    recipeGrid.innerHTML = `
        <div class="empty-state">
            <h3>Please log in to view your profile.</h3>
            <a href="login.html" class="new-btn">Login</a>
        </div>
    `;
    savedGrid.innerHTML = "";
} else {
    loadProfile();
}

// LOAD PROFILE
async function loadProfile() {
    try {
        // User information
        const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`);
        const userData = await userResponse.json();
        if (!userResponse.ok) {
            alert(userData.message || "Could not load profile.");
            return;
        }
        profileName.textContent = userData.name || "Guest User";
        profileEmail.textContent = userData.email || "No email";
        // User recipes
        const recipeResponse = await fetch(`http://localhost:3000/api/recipes/user/${userId}`);
        const userRecipes = await recipeResponse.json();
        if (!recipeResponse.ok) {
            alert(userRecipes.message || "Could not load your recipes.");
            return;
        }
        // Favourites
        const favouriteResponse =await fetch(`http://localhost:3000/api/favourites/${userId}`);
        const favouriteRecipes = await favouriteResponse.json();
        if (!favouriteResponse.ok) {
            alert(favouriteRecipes.message || "Could not load favourites.");
            return;
        }
        document.getElementById("recipeCount").textContent = userRecipes.length;
        document.getElementById("favCount").textContent = favouriteRecipes.length;
        // Display
        displayUserRecipes(userRecipes);
        displayFavouriteRecipes(favouriteRecipes);
    } catch (error) {
        console.error("Profile error:", error);
        alert("Could not connect to server.");
    }
}

// USER RECIPES
function displayUserRecipes(userRecipes) {
    recipeGrid.innerHTML = "";
    if (userRecipes.length === 0) {
        recipeGrid.innerHTML = `
            <div class="empty-state">
                <h3>No recipes created yet.</h3>
                <a href="create.html" class="new-btn">Create</a>
            </div>
        `;
        return;
    }
    userRecipes.forEach(function (recipe) {
        recipeGrid.innerHTML += `
            <a href="recipe.html?id=${recipe.id}&source=user" class="profile-card-small">
                <img src="${recipe.image || "images/recipes/default.jpg"}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </a>
            `;
        }
    );
}

// FAVOURITE RECIPES
function displayFavouriteRecipes(favouriteRecipes) {
    savedGrid.innerHTML = "";
    if (favouriteRecipes.length === 0) {
        savedGrid.innerHTML = `
            <div class="empty-state">
                <h3>No favourites yet.</h3>
                <a href="index.html" class="new-btn">Explore</a>
            </div>
        `;
        return;
    }
    favouriteRecipes.forEach(function (recipe) {
        savedGrid.innerHTML += `
            <a href="recipe.html?id=${recipe.id}&source=user" class="profile-card-small">
                <img src="${recipe.image || "images/recipes/default.jpg"}" alt="${recipe.title}">
                <h3> ${recipe.title}</h3>
            </a>
        `;
    });
}

// TABS
const tabs = document.querySelectorAll(".tab");
tabs.forEach(function (tab) {
    tab.onclick = function () {
        document.querySelectorAll(".tab").forEach(function (t) { 
            t.classList.remove("active");
        });
        document.querySelectorAll(".tab-content").forEach(function (content) {
            content.classList.remove("active");
        });
        tab.classList.add("active");
        if (tab.dataset.tab === "recipes") {
            document.getElementById("recipesTab").classList.add("active");
        }
        if (tab.dataset.tab === "saved") {
            document.getElementById("savedTab").classList.add("active");
        }
    };
});