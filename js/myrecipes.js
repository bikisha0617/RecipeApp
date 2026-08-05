const recipeGrid = document.getElementById("myRecipeGrid");
const searchInput = document.getElementById("searchRecipe");

// Get recipes created by the user
let userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];

// Display recipes
function displayRecipes(recipeList){
    recipeGrid.innerHTML = "";
    if(recipeList.length === 0){
        recipeGrid.innerHTML = `
            <p class="empty-message">
                You haven't created any recipes yet.
            </p>
        `;
        return;
    }
    recipeList.forEach(function(recipe){
        recipeGrid.innerHTML += `
        <div class="recipe-box">
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <p>${recipe.time}</p>
                <div class="recipe-actions">
                    <button class="view-btn" onclick="viewRecipe(${recipe.id})">View</button>
                    <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
                </div>
            </div>
        </div>
        `;
    });
}
displayRecipes(userRecipes);

// Search
searchInput.addEventListener("keyup", function(){
    const keyword = this.value.toLowerCase();
    const filtered = userRecipes.filter(function(recipe){
        return recipe.title.toLowerCase().includes(keyword);
    });
    displayRecipes(filtered);
});

// Open Recipe
function viewRecipe(id){
    window.location.href = `recipe.html?id=${id}`;
}

// Delete Recipe
function deleteRecipe(id){
    const confirmDelete = confirm("Delete this recipe?");
    if(!confirmDelete){
        return;
    }
    userRecipes = userRecipes.filter(function(recipe){
        return recipe.id !== id;
    });
    localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
    displayRecipes(userRecipes);
}