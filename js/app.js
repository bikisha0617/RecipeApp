const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const loginBtn = document.getElementById("loginBtn");

/* Recipes */

function displayRecipes(recipeList){
    recipeContainer.innerHTML = "";
    recipeList.forEach(recipe=>{
        recipeContainer.innerHTML += `
        <div class="recipe-card">
            <img
                src="${recipe.image}"
                class="recipe-image"
                alt="${recipe.title}"
            >
            <div class="recipe-content">
                <h3 class="recipe-title">
                    ${recipe.title}
                </h3>
                <p class="recipe-author">
                    By ${recipe.author}
                </p>
                <div class="recipe-footer">
                    <span class="time">
                        ${recipe.time}
                    </span>
                    <img
                        src="${
                            recipe.favourite
                            ? 'images/icons/images/icons/HeartFilled.png'
                            : 'images/icons/HeartUnfilled.png'
                        }"
                        class="heart"
                        onclick="toggleFavourite(${recipe.id}, this)"
                        alt="Favourite"
                    >
                </div>
            </div>
        </div>
        `;
    });
}

displayRecipes(recipes);

/* Search */

searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();
    displayRecipes(
        recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(keyword)
        )
    );
});

/* Favourite */

function toggleFavourite(id, heart){
    const recipe = recipes.find(recipe => recipe.id === id);
    recipe.favourite = !recipe.favourite;
    if(recipe.favourite){
        heart.src = "images/icons/HeartFilled.png";
    }else{
        heart.src = "images/icons/HeartUnfilled.png";
    }
}

/* Login */

const profileSection = document.getElementById("profileSection");

if(localStorage.getItem("loggedIn") === "true"){
    loginBtn.style.display = "none";
    profileSection.style.display = "flex";
}else{
    loginBtn.style.display = "block";
    profileSection.style.display = "none";
}

loginBtn.onclick = () => {
    window.location = "login.html";
};

dropdownBtn.onclick = (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
};

window.onclick = () => {
    dropdownMenu.classList.remove("show");
};

document.getElementById("switchAccount").onclick = () => {
    localStorage.removeItem("loggedIn");
    window.location = "login.html";
};