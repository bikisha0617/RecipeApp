const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const recipeGrid = document.getElementById("profileRecipeGrid");
const savedGrid = document.getElementById("savedGrid");
const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];

// User Information
profileName.textContent = localStorage.getItem("userName") || "Guest User";
profileEmail.textContent = localStorage.getItem("userEmail") || "guest@email.com";

// Statistics
document.getElementById("recipeCount").textContent = userRecipes.length;
const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
const favouriteRecipes = recipes.filter(function(recipe){
    return favourites.includes(recipe.id);
});
document.getElementById("favCount").textContent = favouriteRecipes.length;

if(userRecipes.length === 0){
    recipeGrid.innerHTML = `
        <div class="empty-state">
            <h3>No recipes created yet.</h3>
            <a href="create.html" class="new-btn">Create</a>
        </div>
    `;
}else{
    userRecipes.forEach(function(recipe){
        recipeGrid.innerHTML += `
            <a href="recipe.html?id=${recipe.id}" class="profile-card-small">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </a>
        `;
    });
}

if(favouriteRecipes.length === 0){
    savedGrid.innerHTML = `
        <div class="empty-state">
            <h3>No favourites yet.</h3>
            <a href="index.html" class="new-btn">Explore</a>
        </div>
    `;
}else{
    favouriteRecipes.forEach(function(recipe){
        savedGrid.innerHTML += `
            <a href="recipe.html?id=${recipe.id}" class="profile-card-small">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </a>
        `;
    });
}

const tabs = document.querySelectorAll(".tab");
tabs.forEach(function(tab){
    tab.onclick = function(){
        document.querySelectorAll(".tab").forEach(function(t){
            t.classList.remove("active");
        });
        document.querySelectorAll(".tab-content").forEach(function(content){
            content.classList.remove("active");
        });
        tab.classList.add("active");
        if(tab.dataset.tab === "recipes"){
            document.getElementById("recipesTab").classList.add("active");
        }
        if(tab.dataset.tab === "saved"){
            document.getElementById("savedTab").classList.add("active");
        }
    };
});