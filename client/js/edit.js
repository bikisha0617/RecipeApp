/* =====================================================
   EDIT RECIPE
===================================================== */


const params =
    new URLSearchParams(
        window.location.search
    );


const recipeId =
    Number(
        params.get("id")
    );


const form =
    document.getElementById("editForm");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const ingredientsContainer =
    document.getElementById("ingredients");

const instructionsContainer =
    document.getElementById("instructions");

const addIngredientButton =
    document.getElementById("addIngredient");

const addInstructionButton =
    document.getElementById("addInstruction");

const saveButton =
    document.getElementById("saveBtn");

let originalRecipe = null;


/* =====================================================
   LOGIN
===================================================== */

if (!isLoggedIn()) {

    alert("Please login first.");

    window.location.href =
        "login.html";
}


/* =====================================================
   TOKEN
===================================================== */

function getToken() {

    const possibleKeys = [
        "token",
        "authToken",
        "accessToken",
        "jwt"
    ];

    for (const key of possibleKeys) {

        const value =
            localStorage.getItem(key);

        if (value) {
            return value;
        }
    }

    return null;
}


/* =====================================================
   CHECK ID
===================================================== */

if (
    !Number.isInteger(recipeId) ||
    recipeId <= 0
) {

    alert("Invalid recipe ID.");

    window.location.href =
        "myrecipes.html";
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        "message " + type;
}


/* =====================================================
   IMAGE URL
===================================================== */

function getImageUrl(image) {

    if (!image) {
        return "";
    }

    const cleanImage =
        String(image).trim();

    if (!cleanImage) {
        return "";
    }

    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {
        return cleanImage;
    }

    if (
        cleanImage.startsWith("uploads/")
    ) {
        return (
            "http://localhost:3000/" +
            cleanImage
        );
    }

    if (
        cleanImage.startsWith("/uploads/")
    ) {
        return (
            "http://localhost:3000" +
            cleanImage
        );
    }

    return (
        "http://localhost:3000/uploads/" +
        encodeURIComponent(cleanImage)
    );
}


/* =====================================================
   ADD INGREDIENT INPUT
===================================================== */

function addIngredient(value = "") {

    const row =
        document.createElement("div");

    row.className =
        "array-row";


    const input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "ingredient-input";

    input.placeholder =
        "Enter ingredient";

    input.value =
        value;


    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.className =
        "remove-item";

    removeButton.textContent =
        "Remove";


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();
        }
    );


    row.appendChild(input);

    row.appendChild(removeButton);

    ingredientsContainer.appendChild(row);
}


/* =====================================================
   ADD INSTRUCTION INPUT
===================================================== */

function addInstruction(value = "") {

    const row =
        document.createElement("div");

    row.className =
        "array-row";


    const input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "instruction-input";

    input.placeholder =
        "Enter instruction";

    input.value =
        value;


    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.className =
        "remove-item";

    removeButton.textContent =
        "Remove";


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();
        }
    );


    row.appendChild(input);

    row.appendChild(removeButton);

    instructionsContainer.appendChild(row);
}


/* =====================================================
   BUTTON EVENTS
===================================================== */

addIngredientButton.addEventListener(
    "click",
    function () {

        addIngredient();
    }
);


addInstructionButton.addEventListener(
    "click",
    function () {

        addInstruction();
    }
);


/* =====================================================
   LOAD RECIPE
===================================================== */

async function loadRecipe() {

    const token =
        getToken();


    if (!token) {

        alert(
            "Your session has expired. Please login again."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:3000/api/recipes/" +
                recipeId
            );


        let data = {};

        try {

            data =
                await response.json();

        } catch (error) {

            data = {};
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load recipe."
            );
        }


        originalRecipe =
            data;


        document.getElementById("title").value =
            data.title || "";


        document.getElementById("description").value =
            data.description || "";


        document.getElementById("category").value =
            data.category || "";


        document.getElementById("time").value =
            data.time || "";


        document.getElementById("servings").value =
            data.servings || "";


        document.getElementById("difficulty").value =
            data.difficulty || "Easy";


        document.getElementById("calories").value =
            data.calories || 0;


        document.getElementById("protein").value =
            data.protein || 0;


        document.getElementById("carbs").value =
            data.carbs || 0;


        document.getElementById("fat").value =
            data.fat || 0;


        const image =
            document.getElementById("currentImage");


        const imageUrl =
            getImageUrl(data.image);


        if (imageUrl) {

            image.src =
                imageUrl;

            image.style.display =
                "block";

            image.onerror =
                function () {

                    image.style.display =
                        "none";
                };

        } else {

            image.style.display =
                "none";
        }


        ingredientsContainer.innerHTML =
            "";


        if (
            Array.isArray(data.ingredients) &&
            data.ingredients.length > 0
        ) {

            data.ingredients.forEach(
                function (ingredient) {

                    addIngredient(
                        ingredient
                    );
                }
            );

        } else {

            addIngredient();
        }


        instructionsContainer.innerHTML =
            "";


        if (
            Array.isArray(data.instructions) &&
            data.instructions.length > 0
        ) {

            data.instructions.forEach(
                function (instruction) {

                    addInstruction(
                        instruction
                    );
                }
            );

        } else {

            addInstruction();
        }


        loading.style.display =
            "none";

        form.style.display =
            "block";


    } catch (error) {

        console.error(
            "Load recipe error:",
            error
        );


        loading.style.display =
            "none";


        showMessage(
            error.message ||
            "Could not load recipe.",
            "error"
        );
    }
}


/* =====================================================
   GET ARRAY VALUES
===================================================== */

function getInputValues(selector) {

    const inputs =
        document.querySelectorAll(
            selector
        );


    const values = [];


    inputs.forEach(
        function (input) {

            const value =
                input.value.trim();


            if (value) {

                values.push(value);
            }
        }
    );


    return values;
}


/* =====================================================
   SAVE RECIPE
===================================================== */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const token =
            getToken();


        if (!token) {

            alert(
                "Your session has expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        const title =
            document.getElementById(
                "title"
            ).value.trim();


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value.trim();


        const time =
            document.getElementById(
                "time"
            ).value.trim();


        const servings =
            document.getElementById(
                "servings"
            ).value.trim();


        const difficulty =
            document.getElementById(
                "difficulty"
            ).value;


        const calories =
            Number(
                document.getElementById(
                    "calories"
                ).value
            ) || 0;


        const protein =
            Number(
                document.getElementById(
                    "protein"
                ).value
            ) || 0;


        const carbs =
            Number(
                document.getElementById(
                    "carbs"
                ).value
            ) || 0;


        const fat =
            Number(
                document.getElementById(
                    "fat"
                ).value
            ) || 0;


        const ingredients =
            getInputValues(
                ".ingredient-input"
            );


        const instructions =
            getInputValues(
                ".instruction-input"
            );


        /* ---------------------------------------------
           VALIDATION
        --------------------------------------------- */

        if (title.length < 2) {

            showMessage(
                "Recipe title must be at least 2 characters.",
                "error"
            );

            return;
        }


        if (title.length > 150) {

            showMessage(
                "Recipe title cannot exceed 150 characters.",
                "error"
            );

            return;
        }


        if (description.length < 5) {

            showMessage(
                "Recipe description must be at least 5 characters.",
                "error"
            );

            return;
        }


        if (!time) {

            showMessage(
                "Cooking time is required.",
                "error"
            );

            return;
        }


        if (!servings) {

            showMessage(
                "Servings are required.",
                "error"
            );

            return;
        }


        if (ingredients.length === 0) {

            showMessage(
                "At least one ingredient is required.",
                "error"
            );

            return;
        }


        if (instructions.length === 0) {

            showMessage(
                "At least one instruction is required.",
                "error"
            );

            return;
        }


        /* ---------------------------------------------
           DISABLE BUTTON
        --------------------------------------------- */

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Saving...";


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/recipes/" +
                    recipeId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token
                        },

                        body:
                            JSON.stringify({

                                title:
                                    title,

                                description:
                                    description,

                                category:
                                    category,

                                time:
                                    time,

                                servings:
                                    servings,

                                difficulty:
                                    difficulty,

                                calories:
                                    Math.max(
                                        0,
                                        calories
                                    ),

                                protein:
                                    Math.max(
                                        0,
                                        protein
                                    ),

                                carbs:
                                    Math.max(
                                        0,
                                        carbs
                                    ),

                                fat:
                                    Math.max(
                                        0,
                                        fat
                                    ),

                                ingredients:
                                    ingredients,

                                instructions:
                                    instructions
                            })
                    }
                );


            let data = {};


            try {

                data =
                    await response.json();

            } catch (error) {

                data = {};
            }


            if (!response.ok) {

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    showMessage(
                        data.message ||
                        "You are not allowed to edit this recipe.",
                        "error"
                    );

                    return;
                }


                throw new Error(
                    data.message ||
                    "Could not update recipe."
                );
            }


            showMessage(
                data.message ||
                "Recipe updated successfully.",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "myrecipes.html";

                },
                800
            );


        } catch (error) {

            console.error(
                "Update recipe error:",
                error
            );


            showMessage(
                error.message ||
                "Could not update recipe.",
                "error"
            );

        } finally {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save Changes";
        }

    }
);


/* =====================================================
   START
===================================================== */

loadRecipe();