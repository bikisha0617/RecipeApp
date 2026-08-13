const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

if (imageInput && preview) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                this.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be smaller than 5 MB.");
                this.value = "";
                return;
            }

            preview.src =
                URL.createObjectURL(file);

            const overlay =
                document.querySelector(
                    ".upload-overlay"
                );

            if (overlay) {
                overlay.style.opacity = "0";
            }
        }
    );
}


/* =====================================================
   INGREDIENTS
===================================================== */

const ingredientList =
    document.getElementById(
        "ingredientList"
    );

const addIngredient =
    document.getElementById(
        "addIngredient"
    );

if (addIngredient && ingredientList) {

    addIngredient.addEventListener(
        "click",
        function () {

            const row =
                document.createElement("div");

            row.className =
                "ingredient-row";

            row.innerHTML = `
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

            ingredientList.appendChild(row);
        }
    );
}


/* =====================================================
   INSTRUCTIONS
===================================================== */

const stepList =
    document.getElementById(
        "stepList"
    );

const addStep =
    document.getElementById(
        "addStep"
    );

if (addStep && stepList) {

    addStep.addEventListener(
        "click",
        function () {

            const row =
                document.createElement("div");

            row.className =
                "step-row";

            row.innerHTML = `
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

            stepList.appendChild(row);
        }
    );
}


/* =====================================================
   REMOVE INGREDIENT / STEP
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "remove-btn"
            )
        ) {

            const parent =
                event.target.parentElement;

            if (parent) {
                parent.remove();
            }
        }
    }
);


/* =====================================================
   CREATE RECIPE
===================================================== */

const recipeForm =
    document.getElementById(
        "recipeForm"
    );

if (recipeForm) {

    recipeForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!isLoggedIn()) {

                alert(
                    "Please login before creating a recipe."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();

            const categoryElement =
                document.getElementById(
                    "category"
                );

            const time =
                document
                    .getElementById("time")
                    .value
                    .trim();

            const servings =
                document
                    .getElementById("servings")
                    .value
                    .trim();

            const difficultyElement =
                document.getElementById(
                    "difficulty"
                );

            const caloriesElement =
                document.getElementById(
                    "calories"
                );

            const proteinElement =
                document.getElementById(
                    "protein"
                );

            const carbsElement =
                document.getElementById(
                    "carbs"
                );

            const fatElement =
                document.getElementById(
                    "fat"
                );


            const category =
                categoryElement
                    ? categoryElement.value.trim()
                    : "";

            const difficulty =
                difficultyElement
                    ? difficultyElement.value
                    : "Easy";

            const calories =
                caloriesElement
                    ? caloriesElement.value
                    : "0";

            const protein =
                proteinElement
                    ? proteinElement.value
                    : "0";

            const carbs =
                carbsElement
                    ? carbsElement.value
                    : "0";

            const fat =
                fatElement
                    ? fatElement.value
                    : "0";


            if (
                title.length < 2 ||
                description.length < 5 ||
                !time ||
                !servings
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            const ingredients = [];

            document
                .querySelectorAll(
                    ".ingredient"
                )
                .forEach(
                    function (input) {

                        const value =
                            input.value.trim();

                        if (value) {
                            ingredients.push(value);
                        }
                    }
                );


            const instructions = [];

            document
                .querySelectorAll(
                    ".step"
                )
                .forEach(
                    function (input) {

                        const value =
                            input.value.trim();

                        if (value) {
                            instructions.push(value);
                        }
                    }
                );


            if (ingredients.length === 0) {

                alert(
                    "Please add at least one ingredient."
                );

                return;
            }


            if (instructions.length === 0) {

                alert(
                    "Please add at least one instruction."
                );

                return;
            }


            const formData =
                new FormData();

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


            const submitButton =
                recipeForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent =
                    "Publishing...";
            }


            try {

                const result =
                    await createRecipe(
                        formData
                    );

                console.log(
                    "Recipe created:",
                    result
                );

                alert(
                    "Recipe published successfully!"
                );

                window.location.href =
                    "myrecipes.html";

            } catch (error) {

                console.error(
                    "Create recipe error:",
                    error
                );

                alert(
                    error.message ||
                    "Could not create recipe."
                );

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        "Publish Recipe";
                }
            }
        }
    );
}