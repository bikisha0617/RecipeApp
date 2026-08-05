// Image Preview
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if(file){
        preview.src = URL.createObjectURL(file);
        document.querySelector(".upload-overlay").style.opacity = "0";
    }
});

// Add Ingredient
const ingredientList = document.getElementById("ingredientList");
const addIngredient = document.getElementById("addIngredient");

addIngredient.addEventListener("click", function () {
    const div = document.createElement("div");
    div.className = "ingredient-row";
    div.innerHTML = `
        <input type="text" class="ingredient" placeholder="Ingredient">
        <button type="button" class="remove-btn">✕</button>
    `;
    ingredientList.appendChild(div);
});

// Add Step
const stepList = document.getElementById("stepList");
const addStep = document.getElementById("addStep");

addStep.addEventListener("click", function () {
    const div = document.createElement("div");
    div.className = "step-row";
    div.innerHTML = `
        <textarea class="step" placeholder="Write a step..."></textarea>
        <button type="button" class="remove-btn">✕</button>
    `;
    stepList.appendChild(div);
});

// Remove Ingredient
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
        e.target.parentElement.remove();
    }
});

// Publish Recipe
const recipeForm = document.getElementById("recipeForm");

recipeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const time = document.getElementById("time").value.trim();
    const servings = document.getElementById("servings").value;
    if (
        title === "" ||
        description === "" ||
        time === "" ||
        servings === ""
    ) {
        alert("Please fill in all required fields.");
        return;
    }
    const ingredients = [];
    document.querySelectorAll(".ingredient").forEach(function (item) {
        if (item.value.trim() !== "") {
            ingredients.push(item.value.trim());
        }
    });
    const instructions = [];
    document.querySelectorAll(".step").forEach(function (item) {
        if (item.value.trim() !== "") {
            instructions.push(item.value.trim());
        }
    });
    const newRecipe = {
        id: Date.now(),
        title,
        description,
        category,
        time,
        servings,
        ingredients,
        instructions,
        favourite: false,
        author: localStorage.getItem("userName") || "You",
        image: preview.src
    };
    let userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    userRecipes.push(newRecipe);
    localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
    alert("Recipe published successfully!");
    window.location.href = "index.html";
});