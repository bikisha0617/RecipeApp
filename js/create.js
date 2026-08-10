// Image
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
            const overlay = document.querySelector(".upload-overlay");
            if (overlay) {
                overlay.style.opacity = "0";
            }
        }
    });
}

// Add Ingredient

const ingredientList = document.getElementById("ingredientList");
const addIngredient = document.getElementById("addIngredient");

if (addIngredient) {
    addIngredient.addEventListener("click", function () {
        const div = document.createElement("div");
        div.className = "ingredient-row";
        div.innerHTML = `
            <input type="text" class="ingredient" placeholder="Ingredient">
            <button type="button" class="remove-btn">✕</button>
        `;
        ingredientList.appendChild(div);
    });
}

// Add step

const stepList = document.getElementById("stepList");
const addStep = document.getElementById("addStep");

if (addStep) {
    addStep.addEventListener("click", function () {
        const div = document.createElement("div");
        div.className = "step-row";
        div.innerHTML = `
            <textarea class="step" placeholder="Write a step."></textarea>
            <button type="button" class="remove-btn">✕</button>
        `;
        stepList.appendChild(div);
    });
}

// Remove

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
        e.target.parentElement.remove();
    }
});

// Publish Recipe

const recipeForm = document.getElementById("recipeForm");

if (recipeForm) {
    recipeForm.addEventListener("submit", async function (e) {
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

        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login before creating a recipe.");
            window.location.href = "login.html";
            return;
        }

        const ingredients = [];

        document.querySelectorAll(".ingredient").forEach(function (item) {
                const value = item.value.trim();
                if (value !== "") {
                    ingredients.push(value);
                }
            });

        const instructions = [];

        document.querySelectorAll(".step").forEach(function (item) {
                const value = item.value.trim();
                if (value !== "") {
                    instructions.push(value);
                }
            });

        try {
            const response = await fetch("http://localhost:3000/api/recipes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: Number(userId),
                        title: title,
                        description: description,
                        category: category,
                        time: time,
                        servings: servings,
                        ingredients: ingredients,
                        instructions: instructions
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Could not publish recipe.");
                return;
            }
            alert("Recipe published successfully!");
            window.location.href = "myrecipes.html";
        } catch (error) {
            console.error("Publish recipe error:", error);
            alert(
                "Could not connect to the server."
            );
        }
    });
}