// ===============================
// Image Preview
// ===============================

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

if (imageInput) {

    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {

            preview.src = URL.createObjectURL(file);

            const overlay =
                document.querySelector(".upload-overlay");

            if (overlay) {
                overlay.style.opacity = "0";
            }
        }
    });
}


// ===============================
// Add Ingredient
// ===============================

const ingredientList =
    document.getElementById("ingredientList");

const addIngredient =
    document.getElementById("addIngredient");

if (addIngredient) {

    addIngredient.addEventListener("click", function () {

        const div = document.createElement("div");

        div.className = "ingredient-row";

        div.innerHTML = `
            <input
                type="text"
                class="ingredient"
                placeholder="Ingredient"
            >

            <button
                type="button"
                class="remove-btn"
            >
                ✕
            </button>
        `;

        ingredientList.appendChild(div);
    });
}


// ===============================
// Add Step
// ===============================

const stepList =
    document.getElementById("stepList");

const addStep =
    document.getElementById("addStep");

if (addStep) {

    addStep.addEventListener("click", function () {

        const div = document.createElement("div");

        div.className = "step-row";

        div.innerHTML = `
            <textarea
                class="step"
                placeholder="Write a step."
            ></textarea>

            <button
                type="button"
                class="remove-btn"
            >
                ✕
            </button>
        `;

        stepList.appendChild(div);
    });
}


// ===============================
// Remove Ingredient / Step
// ===============================

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("remove-btn")) {

        e.target.parentElement.remove();
    }
});


// ===============================
// Publish Recipe
// ===============================

const recipeForm =
    document.getElementById("recipeForm");

if (recipeForm) {

    recipeForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            // ===============================
            // Get Values
            // ===============================

            const title =
                document.getElementById("title").value.trim();

            const description =
                document.getElementById("description").value.trim();

            const categoryElement =
                document.getElementById("category");

            const category =
                categoryElement
                    ? categoryElement.value
                    : "";

            const time =
                document.getElementById("time").value.trim();

            const servings =
                document.getElementById("servings").value.trim();

            const difficultyElement =
                document.getElementById("difficulty");

            const difficulty =
                difficultyElement
                    ? difficultyElement.value
                    : "Easy";

            const caloriesElement =
                document.getElementById("calories");

            const proteinElement =
                document.getElementById("protein");

            const carbsElement =
                document.getElementById("carbs");

            const fatElement =
                document.getElementById("fat");


            const calories =
                caloriesElement
                    ? caloriesElement.value
                    : 0;

            const protein =
                proteinElement
                    ? proteinElement.value
                    : 0;

            const carbs =
                carbsElement
                    ? carbsElement.value
                    : 0;

            const fat =
                fatElement
                    ? fatElement.value
                    : 0;


            // ===============================
            // Validation
            // ===============================

            if (
                title === "" ||
                description === "" ||
                time === "" ||
                servings === ""
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            // ===============================
            // Login Check
            // ===============================

            const userId =
                localStorage.getItem("userId");

            if (!userId) {

                alert(
                    "Please login before creating a recipe."
                );

                window.location.href =
                    "login.html";

                return;
            }


            // ===============================
            // Ingredients
            // ===============================

            const ingredients = [];

            document
                .querySelectorAll(".ingredient")
                .forEach(function (item) {

                    const value =
                        item.value.trim();

                    if (value !== "") {
                        ingredients.push(value);
                    }
                });


            // ===============================
            // Instructions
            // ===============================

            const instructions = [];

            document
                .querySelectorAll(".step")
                .forEach(function (item) {

                    const value =
                        item.value.trim();

                    if (value !== "") {
                        instructions.push(value);
                    }
                });


            // ===============================
            // FormData
            // ===============================

            const formData =
                new FormData();

            formData.append(
                "user_id",
                userId
            );

            formData.append(
                "title",
                title
            );

            formData.append(
                "description",
                description
            );

            formData.append(
                "category",
                category
            );

            formData.append(
                "time",
                time
            );

            formData.append(
                "servings",
                servings
            );

            formData.append(
                "difficulty",
                difficulty
            );

            formData.append(
                "calories",
                calories
            );

            formData.append(
                "protein",
                protein
            );

            formData.append(
                "carbs",
                carbs
            );

            formData.append(
                "fat",
                fat
            );

            formData.append(
                "ingredients",
                JSON.stringify(ingredients)
            );

            formData.append(
                "instructions",
                JSON.stringify(instructions)
            );


            // ===============================
            // Image
            // ===============================

            if (
                imageInput &&
                imageInput.files &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "image",
                    imageInput.files[0]
                );
            }


            // ===============================
            // Send to Server
            // ===============================

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/api/recipes",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Create recipe error:",
                        data
                    );

                    alert(
                        data.message ||
                        "Could not create recipe."
                    );

                    return;
                }


                console.log(
                    "Recipe created:",
                    data
                );


                alert(
                    "Recipe published successfully!"
                );


                window.location.href =
                    "myrecipes.html";


            } catch (error) {

                console.error(
                    "Publish recipe error:",
                    error
                );

                alert(
                    "Could not connect to the server."
                );
            }
        }
    );
}