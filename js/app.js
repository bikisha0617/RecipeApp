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

loginBtn.addEventListener("click",()=>{
    window.location="login.html";
});

/* Dropdown */

dropdownBtn.addEventListener("click",(e)=>{
    e.stopPropagation();
    if(dropdownMenu.style.display==="block"){
        dropdownMenu.style.display="none";
    }else{
        dropdownMenu.style.display="block";
    }
});

/* Hide Dropdown */

window.addEventListener("click",()=>{
    dropdownMenu.style.display="none";
});

/* Login Option */

document.querySelector(".login-item").addEventListener("click",()=>{
    window.location="login.html";
});