const API_BASE_URL = "http://localhost:3000/api";

function getToken() {
    return localStorage.getItem("token");
}
function getAuthToken() {
    return localStorage.getItem("token");
}
function getCurrentUser() {
    try {
        const user = localStorage.getItem("user");
        if (!user) {
            return null;
        }
        return JSON.parse(user);
    } catch (error) {
        console.error("Could not read saved user:", error);
        return null;
    }
}

function getUserId() {
    const user = getCurrentUser();
    if (user && user.id) {
        return Number(user.id);
    }
    const savedId = localStorage.getItem("userId");
    if (savedId) {
        return Number(savedId);
    }
    return null;
}

function getUserRole() {
    return localStorage.getItem("role") || "";
}
function isLoggedIn() {
    return Boolean(
        localStorage.getItem("token") &&
        localStorage.getItem("loggedIn") === "true"
    );
}

/* Save login */
function saveAuth(token, user, role) {
    if (!token) {
        return;
    }
    localStorage.setItem("token",token);
    localStorage.setItem("loggedIn","true");
    localStorage.setItem("role",role || "user");
    if (user) {
        localStorage.setItem("user",JSON.stringify(user));
        if (user.id !== undefined) {
            localStorage.setItem("userId",String(user.id));
        }
        if (user.name !== undefined) {
            localStorage.setItem("userName",user.name);
        }
        if (user.email !== undefined) {
            localStorage.setItem("userEmail",user.email);
        }
    }
}

/* Logout */
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    window.location.href = "login.html";
}

function getAuthHeaders(includeJson) {
    const headers = {};
    if (includeJson !== false) {
        headers["Content-Type"] ="application/json";
    }
    const token = getAuthToken();
    if (token) {
        headers["Authorization"] ="Bearer " + token;
    }
    return headers;
}

async function apiRequest(endpoint, options) {
    options = options || {};
    const url =API_BASE_URL + endpoint;
    const isFormData =options.body instanceof FormData;
    const headers = {
        ...getAuthHeaders(!isFormData),
        ...(options.headers || {})
    };
    if (isFormData) {
        delete headers["Content-Type"];
    }
    const config = {
        ...options,
        headers: headers
    };
    try {
        const response =await fetch(url,config);
        const contentType =response.headers.get("content-type") || "";
        let data;
        if (contentType.includes("application/json")) {
            data =await response.json();
        } else {
            data =await response.text();
        }
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userType");
        }
        if (!response.ok) {
            let message ="Request failed.";
            if (data && typeof data === "object" && data.message) {
                message = data.message;
            }
            if (typeof data === "string" && data.trim()) {
                message = data;
            }
            const error =new Error(message);
            error.status =response.status;
            error.data =data;
            throw error;
        }
        return data;
    } catch (error) {
        console.error("API request error:",error);
        throw error;
    }
}

/* Recipes */
async function getRecipes() {
    return await apiRequest("/recipes",
        {
            method: "GET"
        }
    );
}
async function getAllRecipes() {
    return await getRecipes();
}
async function getRecipe(id) {
    const recipeId =Number(id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
        throw new Error("Invalid recipe ID.");
    }
    return await apiRequest("/recipes/" + recipeId,
        {
            method: "GET"
        }
    );
}

async function getMyRecipes(userId) {
    const id =Number(userId || getUserId());
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid user ID.");
    }
    return await apiRequest("/recipes/user/" + id,
        {
            method: "GET"
        }
    );
}

async function getUserRecipes(userId) {
    return await getMyRecipes(userId);
}

/* Create Recipe */
async function createRecipe(formData) {
    return await apiRequest("/recipes",
        {
            method: "POST",
            body: formData
        }
    );
}

/* Update Recipe */
async function updateRecipe(id,formData) {
    const recipeId =Number(id);
    return await apiRequest("/recipes/" + recipeId,
        {
            method: "PUT",
            body: formData
        }
    );
}

/* Delete Recipe */
async function deleteRecipe(id) {
    const recipeId =Number(id);
    return await apiRequest("/recipes/" + recipeId,
        {
            method: "DELETE"
        }
    );
}

async function deleteRecipeFromAPI(id) {
    return await deleteRecipe(id);
}

/* Favourites */
async function getFavourites() {
    return await apiRequest("/favourites",
        {
            method: "GET"
        }
    );
}

async function addFavourite(recipeId) {
    const id =Number(recipeId);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid recipe ID.");
    }
    return await apiRequest("/favourites",
        {
            method: "POST",
            body: JSON.stringify({
                recipe_id: id
            })
        }
    );
}
async function removeFavourite(recipeId) {
    const id =Number(recipeId);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid recipe ID.");
    }
    return await apiRequest("/favourites/" + id,
        {
            method: "DELETE"
        }
    );
}

/* User profile */
async function getMyProfile() {
    return await apiRequest("/users/me",
        {
            method: "GET"
        }
    );
}

async function getCurrentUser() {
    return await getMyProfile();
}

async function updateProfile(userId,data) {
    const id =Number(userId || getUserId());
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid user ID.");
    }
    return await apiRequest("/users/" + id,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );
}

/* Delete Account */
async function deleteAccount(userId) {
    const id =Number(userId || getUserId());
    if (!Number.isInteger(id) ||id <= 0) {
        throw new Error("Invalid user ID.");
    }
    return await apiRequest("/users/" + id,
        {
            method: "DELETE"
        }
    );
}