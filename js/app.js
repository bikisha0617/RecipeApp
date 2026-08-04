const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");

const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const loginBtn = document.getElementById("loginBtn");

/* --------------------------
DISPLAY RECIPES
---------------------------*/

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

                    <span
                        class="heart"
                        onclick="toggleFavourite(${recipe.id})"
                    >
                        ${recipe.favourite ? "❤️" : "🤍"}
                    </span>

                </div>

            </div>

        </div>

        `;

    });

}

displayRecipes(recipes);

/* --------------------------
SEARCH
---------------------------*/

searchInput.addEventListener("keyup", function(){

    const keyword = this.value.toLowerCase();

    const filtered = recipes.filter(recipe=>{

        return recipe.title.toLowerCase().includes(keyword);

    });

    displayRecipes(filtered);

});

/* --------------------------
FAVOURITE
---------------------------*/

function toggleFavourite(id){

    const recipe = recipes.find(item=>item.id===id);

    recipe.favourite = !recipe.favourite;

    displayRecipes(recipes);

}

/* --------------------------
LOGIN
---------------------------*/

loginBtn.addEventListener("click",()=>{

    window.location="login.html";

});

/* --------------------------
DROPDOWN
---------------------------*/

dropdownBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    if(dropdownMenu.style.display==="block"){

        dropdownMenu.style.display="none";

    }else{

        dropdownMenu.style.display="block";

    }

});

/* --------------------------
HIDE DROPDOWN
---------------------------*/

window.addEventListener("click",()=>{

    dropdownMenu.style.display="none";

});

/* --------------------------
LOGIN OPTION
---------------------------*/

document.querySelector(".login-item").addEventListener("click",()=>{

    window.location="login.html";

});