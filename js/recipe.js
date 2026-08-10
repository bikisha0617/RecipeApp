const params = new URLSearchParams(window.location.search);
const recipeId = Number(params.get("id"));

// Get default and user-created recipes
const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
const allRecipes = [...recipes, ...userRecipes];

// Find selected recipe
const recipe = allRecipes.find(r => r.id === recipeId);

// Get favourites
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
if(recipe){
    document.getElementById("recipeImage").src = recipe.image;
    document.getElementById("recipeImage").alt = recipe.title;
    document.getElementById("recipeTitle").textContent = recipe.title;
    document.getElementById("recipeAuthor").textContent = "By " + recipe.author;
    document.getElementById("recipeTime").textContent = recipe.time;
    document.getElementById("recipeServings").textContent = recipe.servings || "-";
    document.getElementById("recipeDifficulty").textContent = recipe.difficulty || "-";
    document.getElementById("recipeDescription").textContent = recipe.description || "";
    const ingredientsList = document.getElementById("ingredientsList");
    ingredientsList.innerHTML = "";
    if(recipe.ingredients){
        recipe.ingredients.forEach(function(item){
            const li = document.createElement("li");
            li.textContent = item;
            ingredientsList.appendChild(li);
        });
    }
    const instructionsList = document.getElementById("instructionsList");
    instructionsList.innerHTML = "";
    if(recipe.instructions){
        recipe.instructions.forEach(function(step){
            const li = document.createElement("li");
            li.textContent = step;
            instructionsList.appendChild(li);
        });
    }
    const nutritionList = document.getElementById("nutritionList");
    nutritionList.innerHTML = "";
    if(recipe.nutrition){
        const nutrition = recipe.nutrition;
        nutritionList.innerHTML += `
            <li>Calories: ${nutrition.calories || "-"} kcal</li>
            <li>Protein: ${nutrition.protein || "-"} g</li>
            <li>Carbs: ${nutrition.carbs || "-"} g</li>
            <li>Fat: ${nutrition.fat || "-"} g</li>
        `;
    }
    const heart = document.getElementById("heart");
    updateHeart();
    function updateHeart(){
        if(favourites.includes(recipe.id)){
            heart.src = "images/icons/HeartFilled.png";
        }else{
            heart.src = "images/icons/HeartUnfilled.png";
        }
    }
    heart.onclick = function(){
        const index = favourites.indexOf(recipe.id);
        if(index === -1){
            favourites.push(recipe.id);
        }else{
            favourites.splice(index,1);
        }
        localStorage.setItem(
            "favourites",
            JSON.stringify(favourites)
        );
        updateHeart();
    };
}else{
    document.querySelector(".recipe-page").innerHTML = `
        <h2>Recipe not found.</h2>
    `;
}