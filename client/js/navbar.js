const loginBtn = document.getElementById("loginBtn");
const profileSection = document.getElementById("profileSection");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownName = document.getElementById("dropdownName");
const dropdownEmail = document.getElementById("dropdownEmail");
const switchAccount = document.getElementById("switchAccount");


/* Check login */
function updateNavbar() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const userId = localStorage.getItem("userId");
    if (loggedIn && userId) {
        /* Hide login button */
        if (loginBtn) {
            loginBtn.style.display = "none";
        }
        /* Show profile */
        if (profileSection) {
            profileSection.style.display = "flex";
        }
        /* Show user name */
        if (dropdownName) {
            dropdownName.textContent = localStorage.getItem("userName") || "Guest User";
        }
        /* Show user email */
        if (dropdownEmail) {
            dropdownEmail.textContent = localStorage.getItem("userEmail") || "guest@email.com";
        }
    } else {
        /* Show login button */
        if (loginBtn) {
            loginBtn.style.display = "block";
        }
        /* Hide profile */
        if (profileSection) {
            profileSection.style.display = "none";
        }
    }
}
/* Run when page loads */
updateNavbar();

/* Login Button */
if (loginBtn) {
    loginBtn.onclick = function () {
        window.location.href = "login.html";

    };
}

/* Dropdown */
if (dropdownBtn) {
    dropdownBtn.onclick = function (e) {
        e.stopPropagation();
        if (!dropdownMenu) {
            return;
        }
        if (dropdownMenu.style.display === "block") {
            dropdownMenu.style.display = "none";
        } else {
            dropdownMenu.style.display = "block";
        }
    };
}
/* Close dropdown */
window.onclick = function () {
    if (dropdownMenu) {
        dropdownMenu.style.display = "none";
    }
};

/* switch account/ logout */
if (switchAccount) {
    switchAccount.onclick = function () {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    };
}