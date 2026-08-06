const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const loginBtn = document.getElementById("loginBtn");

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

/* Recipes */

function displayRecipes(recipeList){
    recipeContainer.innerHTML = "";
    recipeList.forEach(function(recipe){
        const isFavourite = favourites.includes(recipe.id);
        recipeContainer.innerHTML += `
        <div class="recipe-card">
            <a href="recipe.html?id=${recipe.id}">
                <img src="${recipe.image}" class="recipe-image" alt="${recipe.title}">
            </a>
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
                    <img src="${isFavourite ? "images/icons/HeartFilled.png" : "images/icons/heart.png"}" class="heart" onclick="toggleFavourite(${recipe.id})">
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

function toggleFavourite(id){
    const index = favourites.indexOf(id);
    if(index === -1){
        favourites.push(id);
    }else{
        favourites.splice(index,1);
    }
    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );
    displayRecipes(recipes);
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