const API_BASE_URL = "http://localhost:3000/api";

function getAuthToken() {
    return localStorage.getItem("token");
}

function getAuthHeaders(includeJson = true) {
    const headers = {};
    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }
    const token = getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function apiRequest(
    endpoint,
    options = {}
) {
    const url =
        `${API_BASE_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(
                !(options.body instanceof FormData)
            ),
            ...(options.headers || {})
        }
    };
    try {
        const response =
            await fetch(
                url,
                config
            );
        let data = null;
        const contentType =
            response.headers.get(
                "content-type"
            );
        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {
            data =
                await response.json();
        } else {
            data =
                await response.text();
        }
        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );
            localStorage.removeItem(
                "loggedIn"
            );
            localStorage.removeItem(
                "userId"
            );
            localStorage.removeItem(
                "userName"
            );
            localStorage.removeItem(
                "userEmail"
            );
            localStorage.removeItem(
                "userType"
            );
        }
        return {
            ok: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error(
            "API request error:",
            error
        );
        throw error;
    }
}
async function getAllRecipes() {
    return await apiRequest(
        "/recipes",
        {
            method: "GET"
        }
    );
}

async function getRecipe(
    id
) {
    return await apiRequest(
        `/recipes/${Number(id)}`,
        {
            method: "GET"
        }
    );
}

async function getUserRecipes(
    userId
) {
    return await apiRequest(
        `/recipes/user/${Number(userId)}`,
        {
            method: "GET"
        }
    );
}

async function createRecipe(
    formData
) {
    return await apiRequest(
        "/recipes",
        {
            method: "POST",
            body: formData
        }
    );
}

async function updateRecipe(
    id,
    formData
) {
    return await apiRequest(
        `/recipes/${Number(id)}`,
        {
            method: "PUT",
            body: formData
        }
    );
}

async function deleteRecipeFromAPI(
    id
) {
    return await apiRequest(
        `/recipes/${Number(id)}`,
        {
            method: "DELETE"
        }
    );
}