document.addEventListener("DOMContentLoaded", function () {
    const profileName =document.getElementById("profileName");
    const profileEmail =document.getElementById("profileEmail");
    const recipeGrid =document.getElementById("profileRecipeGrid");
    const savedGrid =document.getElementById("savedGrid");
    const recipeCount =document.getElementById("recipeCount");
    const savedCount =document.getElementById("savedCount");
    const favCount =document.getElementById("favCount");

    if (!isLoggedIn()) {
        if (profileName) {
            profileName.textContent = "Guest User";
        }
        if (profileEmail) {
            profileEmail.textContent = "Please log in";
        }
        if (recipeGrid) {
            recipeGrid.innerHTML =
                "<div class='empty-state'>" +
                "<h3>Please log in to view your profile.</h3>" +
                "<a href='login.html' class='new-btn'>Login</a>" +
                "</div>";
        }
        if (savedGrid) {
            savedGrid.innerHTML = "";
        }
        return;
    }

    const userId = getUserId();
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    function getImageUrl(image) {
        if (!image) {
            return "images/placeholder.jpg";
        }
        const clean = String(image).trim();
        if (!clean) {
            return "images/placeholder.jpg";
        }
        if (clean.startsWith("http://") || clean.startsWith("https://")) {
            return clean;
        }
        if (clean.startsWith("images/")) {
            return clean;
        }
        if (clean.startsWith("/images/")) {
            return "http://localhost:3000" + clean;
        }
        if (clean.startsWith("uploads/")) {
            return "http://localhost:3000/" + clean;
        }
        if (clean.startsWith("/uploads/")) {
            return "http://localhost:3000" + clean;
        }
        return ("http://localhost:3000/uploads/" +encodeURIComponent(clean));
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) {
            return "";
        }
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    /* Display recipes */
    function displayRecipes(container,recipes,emptyMessage,linkText,linkHref) {
        if (!container) {
            return;
        }
        container.innerHTML = "";
        if (!Array.isArray(recipes) || recipes.length === 0) {
            container.innerHTML =
                "<div class='empty-state'>" +
                "<h3>" +escapeHtml(emptyMessage) +"</h3>" +
                "<a href='" +linkHref +"' class='new-btn'>" +escapeHtml(linkText) +"</a>" +
                "</div>";
            return;
        }
        recipes.forEach(function (recipe) {
            const recipeId = Number(recipe.id);
            const image =getImageUrl(recipe.image);
            const title =escapeHtml(recipe.title || "Recipe");
            container.innerHTML +=
                "<a href='recipe.html?id=" +recipeId +"' class='profile-card-small'>" +
                "<img src='" +image +"' " +"alt='" +title +"' " +
                "onerror=\"this.onerror=null;" +
                "this.src='images/placeholder.jpg';\">" +
                "<h3>" +title +"</h3>" +
                "</a>";
        });
    }

    /* Load profile */
    async function loadProfile() {
        try {
            const user =await getMyProfile();
            const recipes =await getMyRecipes(userId);
            const favourites =await getFavourites();
            /* Profile Information */
            if (profileName) {
                profileName.textContent = user.name || "User";
            }
            if (profileEmail) {
                profileEmail.textContent = user.email || "";
            }
            const totalRecipes = Array.isArray(recipes) ? recipes.length : 0;
            const totalFavourites = Array.isArray(favourites) ? favourites.length : 0;
            if (recipeCount) {
                recipeCount.textContent =totalRecipes;
            }
            if (savedCount) {
                savedCount.textContent =totalFavourites;
            }
            if (favCount) {
                favCount.textContent =totalFavourites;
            }
            displayRecipes(recipeGrid,recipes,"No recipes created yet.","Create","create.html");
            displayRecipes(savedGrid,favourites,"No favourites yet.","Explore","index.html");

            const storedUser =getCurrentUser() || {};
            storedUser.id =user.id;
            storedUser.name =user.name;
            storedUser.email =user.email;
            localStorage.setItem("user",JSON.stringify(storedUser));
            localStorage.setItem("userName",user.name || "");
            localStorage.setItem("userEmail",user.email || "");
        } catch (error) {
            console.error("Profile error:",error);
            if (recipeGrid) {
                recipeGrid.innerHTML =
                    "<div class='empty-state'>" +
                    "<h3>" +
                    escapeHtml(error.message ||"Could not load profile.") +
                    "</h3>" +
                    "</div>";
            }
            if (savedGrid) {
                savedGrid.innerHTML = "";
            }
        }
    }
    const tabs =document.querySelectorAll(".tab");
    const tabContents =document.querySelectorAll(".tab-content");
    tabs.forEach(function (tab) {
        tab.addEventListener("click",
            function () {
                tabs.forEach(function (item) {
                    item.classList.remove("active");
                });
                tabContents.forEach(function (content) {
                    content.classList.remove("active");
                });
                tab.classList.add("active");
                if (tab.dataset.tab === "recipes") {
                    const recipesTab =document.getElementById("recipesTab");
                    if (recipesTab) {
                        recipesTab.classList.add("active");
                    }
                }
                if (tab.dataset.tab === "saved") {
                    const savedTab =document.getElementById("savedTab");
                    if (savedTab) {
                        savedTab.classList.add("active");
                    }
                }
            }
        );
    });
    loadProfile();
});