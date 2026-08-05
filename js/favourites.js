const favouriteGrid = document.getElementById("favouriteGrid");
const searchInput = document.getElementById("searchFavourite");
const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
const allRecipes = [...recipes, ...userRecipes];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

function displayRecipes(recipeList){
    favouriteGrid.innerHTML = "";
    if(recipeList.length === 0){
        favouriteGrid.innerHTML = `
            <div class="empty-state">
                <h2>No favourites yet</h2>
                <a href="index.html">Explore</a>
            </div>
        `;
        return;
    }
    recipeList.forEach(function(recipe){
        favouriteGrid.innerHTML += `
        <div class="recipe-card">
            <a href="recipe.html?id=${recipe.id}">
                <img src="${recipe.image}" alt="${recipe.title}">
            </a>
            <div class="recipe-content">
                <h3>${recipe.title}</h3>
                <p>${recipe.time}</p>
                <div class="buttons">
                    <button class="view-btn" onclick="viewRecipe(${recipe.id})">View</button>
                    <button class="remove-btn" onclick="removeFavourite(${recipe.id})">Remove</button>
                </div>
            </div>
        </div>
        `;
    });
}

function getFavouriteRecipes(){
    return allRecipes.filter(function(recipe){
        return favourites.includes(recipe.id);
    });
}

displayRecipes(getFavouriteRecipes());
searchInput.addEventListener("keyup", function(){
    const keyword = this.value.toLowerCase();
    const filtered = getFavouriteRecipes().filter(function(recipe){
        return recipe.title.toLowerCase().includes(keyword);
    });
    displayRecipes(filtered);
});

function removeFavourite(id){
    favourites = favourites.filter(function(item){
        return item !== id;
    });
    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );
    displayRecipes(getFavouriteRecipes());
}

function viewRecipe(id){
    window.location.href = "recipe.html?id=" + id;
}