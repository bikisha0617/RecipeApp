const params = new URLSearchParams(window.location.search);
const recipeId = Number(params.get("id"));
const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
const allRecipes = [...recipes, ...userRecipes];
const recipe = allRecipes.find(r => r.id === recipeId);

if(recipe){
    document.getElementById("recipeImage").src = recipe.image;
    document.getElementById("recipeImage").alt = recipe.title;
    document.getElementById("recipeTitle").textContent = recipe.title;
    document.getElementById("recipeAuthor").textContent = "By " + recipe.author;
    document.getElementById("recipeTime").textContent = recipe.time;
    document.getElementById("recipeServings").textContent = recipe.servings;
    document.getElementById("recipeDescription").textContent = recipe.description;
    const ingredientsList = document.getElementById("ingredientsList");
    recipe.ingredients.forEach(item=>{
        const li = document.createElement("li");
        li.textContent = item;
        ingredientsList.appendChild(li);
    });
    const instructionsList =
        document.getElementById("instructionsList");
    recipe.instructions.forEach(step=>{
        const li = document.createElement("li");
        li.textContent = step;
        instructionsList.appendChild(li);
    });
    const nutritionList = document.getElementById("nutritionList");
    recipe.nutrition.forEach(nutrient=>{
        const li = document.createElement("li");
        li.textContent = nutrient;
        nutritionList.appendChild(li);
    });

    const heart = document.getElementById("heart");
    heart.src = recipe.favourite ? "images/icons/HeartFilled.png" : "images/icons/HeartUnfilled.png";
    heart.onclick = () => {
        recipe.favourite = !recipe.favourite;
        heart.src = recipe.favourite ? "images/icons/HeartFilled.png" : "images/icons/HeartUnfilled.png";
    };
}else{
    document.querySelector(".recipe-page").innerHTML = "<h2>Recipe not found.</h2>";
}