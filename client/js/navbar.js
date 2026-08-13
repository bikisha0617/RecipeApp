document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.getElementById("loginBtn");
    const profileSection = document.getElementById("profileSection");
    const dropdownBtn = document.getElementById("dropdownBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const dropdownName = document.getElementById("dropdownName");
    const dropdownEmail = document.getElementById("dropdownEmail");
    const switchAccount = document.getElementById("switchAccount");

    const token = getToken();
    const user = getCurrentUser();
    const role = getUserRole();

    /* =========================
       LOGIN STATE
    ========================= */

    if (token && user) {

        if (loginBtn) {
            loginBtn.style.display = "none";
        }

        if (profileSection) {
            profileSection.style.display = "flex";
        }

        if (dropdownName) {
            dropdownName.textContent =
                user.name || user.username || "User";
        }

        if (dropdownEmail) {
            dropdownEmail.textContent =
                user.email || user.username || "";
        }

    } else {

        if (loginBtn) {
            loginBtn.style.display = "block";
        }

        if (profileSection) {
            profileSection.style.display = "none";
        }
    }


    /* =========================
       ADMIN LINK
    ========================= */

    if (role === "admin") {

        const navLinks =
            document.querySelector(".nav-links");

        if (navLinks &&
            !navLinks.querySelector('a[href="admin.html"]')) {

            const adminLink =
                document.createElement("a");

            adminLink.href = "admin.html";
            adminLink.textContent = "Admin";

            navLinks.appendChild(adminLink);
        }
    }


    /* =========================
       LOGIN BUTTON
    ========================= */

    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            function () {
                window.location.href = "login.html";
            }
        );
    }


    /* =========================
       DROPDOWN
    ========================= */

    if (dropdownBtn && dropdownMenu) {

        dropdownBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                if (dropdownMenu.style.display === "block") {
                    dropdownMenu.style.display = "none";
                } else {
                    dropdownMenu.style.display = "block";
                }
            }
        );
    }


    /* =========================
       CLOSE DROPDOWN
    ========================= */

    document.addEventListener(
        "click",
        function (event) {

            if (!dropdownMenu) {
                return;
            }

            if (
                event.target !== dropdownMenu &&
                !dropdownMenu.contains(event.target) &&
                event.target !== dropdownBtn
            ) {
                dropdownMenu.style.display = "none";
            }
        }
    );


    /* =========================
       LOGOUT
    ========================= */

    if (switchAccount) {

        switchAccount.textContent =
            token ? "Logout" : "Login";

        switchAccount.addEventListener(
            "click",
            function () {

                if (token) {
                    logout();
                } else {
                    window.location.href = "login.html";
                }
            }
        );
    }

});