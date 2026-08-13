const API_BASE_URL = "http://localhost:3000/api";


// ====================================================
// GET TOKEN
// ====================================================

function getToken() {

    return localStorage.getItem("token");

}


// ====================================================
// GET CURRENT USER
// ====================================================

function getCurrentUser() {

    const user =
        localStorage.getItem("user");


    if (!user) {

        return null;

    }


    try {

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "Could not read stored user:",
            error
        );

        return null;

    }

}


// ====================================================
// SAVE AUTHENTICATION DATA
// ====================================================

function saveAuth(token, user) {

    if (token) {

        localStorage.setItem(
            "token",
            token
        );

    }


    if (user) {

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

    }

}


// ====================================================
// CLEAR AUTHENTICATION DATA
// ====================================================

function clearAuth() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

}


// ====================================================
// API REQUEST
// ====================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        getToken();


    const headers = {
        ...(options.headers || {})
    };


    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;

    }


    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch (error) {

        data = null;

    }


    if (!response.ok) {

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            const currentToken =
                getToken();


            if (
                currentToken &&
                response.status === 401
            ) {

                clearAuth();

            }

        }


        throw new Error(
            data?.message ||
            "Something went wrong with the request."
        );

    }


    return data;

}


// ====================================================
// CHECK WHETHER USER IS LOGGED IN
// ====================================================

function isLoggedIn() {

    return Boolean(
        getToken() &&
        getCurrentUser()
    );

}


// ====================================================
// REQUIRE LOGIN
// ====================================================

function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


// ====================================================
// LOGOUT
// ====================================================

function logout() {

    clearAuth();

    window.location.href =
        "login.html";

}


// ====================================================
// EXPORT / GLOBAL ACCESS
// ====================================================

window.API_BASE_URL = API_BASE_URL;

window.getToken = getToken;

window.getCurrentUser = getCurrentUser;

window.saveAuth = saveAuth;

window.clearAuth = clearAuth;

window.apiRequest = apiRequest;

window.isLoggedIn = isLoggedIn;

window.requireLogin = requireLogin;

window.logout = logout;