document.addEventListener("DOMContentLoaded", function () {

    const saveBtn =
        document.getElementById("saveBtn");

    const deleteBtn =
        document.getElementById("deleteBtn");

    const modal =
        document.getElementById("deleteModal");

    const cancelDelete =
        document.getElementById("cancelDelete");

    const confirmDelete =
        document.getElementById("confirmDelete");

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const notificationsInput =
        document.getElementById("notifications");

    const darkModeInput =
        document.getElementById("darkMode");

    const changePhotoBtn =
        document.getElementById("changePhoto");


    /* =========================
       LOGIN CHECK
    ========================= */

    if (!isLoggedIn()) {

        alert("Please log in first.");

        window.location.href =
            "login.html";

        return;
    }


    /* =========================
       USER ID
    ========================= */

    const userId =
        getUserId();

    if (!userId) {

        logout();

        return;
    }


    /* =========================
       DARK MODE
    ========================= */

    function applyDarkMode(enabled) {

        document.body.classList.toggle(
            "dark-mode",
            Boolean(enabled)
        );
    }


    /* =========================
       LOAD SETTINGS
    ========================= */

    async function loadSettings() {

        try {

            const user =
                await getMyProfile();


            /* =========================
               NAME
            ========================= */

            if (nameInput) {

                nameInput.value =
                    user.name || "";
            }


            /* =========================
               EMAIL
            ========================= */

            if (emailInput) {

                emailInput.value =
                    user.email || "";
            }


            /* =========================
               NOTIFICATIONS
            ========================= */

            if (notificationsInput) {

                notificationsInput.checked =
                    Boolean(
                        user.notifications
                    );
            }


            /* =========================
               DARK MODE
            ========================= */

            if (darkModeInput) {

                darkModeInput.checked =
                    Boolean(
                        user.darkMode
                    );

                applyDarkMode(
                    user.darkMode
                );
            }


            /* =========================
               KEEP LOCAL STORAGE
               UP TO DATE
            ========================= */

            const storedUser =
                getCurrentUser() || {};

            storedUser.id =
                user.id || userId;

            storedUser.name =
                user.name || "";

            storedUser.email =
                user.email || "";

            localStorage.setItem(
                "user",
                JSON.stringify(storedUser)
            );

            localStorage.setItem(
                "userId",
                String(
                    user.id || userId
                )
            );

            localStorage.setItem(
                "userName",
                user.name || ""
            );

            localStorage.setItem(
                "userEmail",
                user.email || ""
            );

        } catch (error) {

            console.error(
                "Load settings error:",
                error
            );

            alert(
                error.message ||
                "Could not load settings."
            );
        }
    }


    /* =========================
       DARK MODE TOGGLE
    ========================= */

    if (darkModeInput) {

        darkModeInput.addEventListener(
            "change",
            function () {

                applyDarkMode(
                    darkModeInput.checked
                );
            }
        );
    }


    /* =========================
       CHANGE PHOTO
       
       No photo API currently
       exists in api.js.
    ========================= */

    if (changePhotoBtn) {

        changePhotoBtn.addEventListener(
            "click",
            function () {

                alert(
                    "Profile photo upload is not available yet."
                );
            }
        );
    }


    /* =========================
       SAVE CHANGES
    ========================= */

    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            async function () {

                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const notifications =
                    notificationsInput
                        ? notificationsInput.checked
                        : false;

                const darkMode =
                    darkModeInput
                        ? darkModeInput.checked
                        : false;


                /* =========================
                   VALIDATION
                ========================= */

                if (name.length < 2) {

                    alert(
                        "Name must be at least 2 characters."
                    );

                    return;
                }


                if (!email) {

                    alert(
                        "Email is required."
                    );

                    return;
                }


                /* Basic email validation */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    !emailPattern.test(email)
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;
                }


                /* =========================
                   DISABLE BUTTON
                ========================= */

                saveBtn.disabled = true;

                const originalText =
                    saveBtn.textContent;

                saveBtn.textContent =
                    "Saving...";


                try {

                    /*
                     * IMPORTANT:
                     * Password is intentionally NOT
                     * sent here because the current
                     * api.js/backend does not expose
                     * a password-change endpoint.
                     */

                    const result =
                        await updateProfile(
                            userId,
                            {
                                name: name,
                                email: email,
                                notifications:
                                    notifications,
                                darkMode:
                                    darkMode
                            }
                        );


                    /* =========================
                       UPDATE LOCAL USER
                    ========================= */

                    const updatedUser =
                        result &&
                        result.user
                            ? result.user
                            : getCurrentUser() || {};


                    updatedUser.id =
                        updatedUser.id ||
                        userId;

                    updatedUser.name =
                        name;

                    updatedUser.email =
                        email;

                    updatedUser.notifications =
                        notifications;

                    updatedUser.darkMode =
                        darkMode;


                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            updatedUser
                        )
                    );

                    localStorage.setItem(
                        "userId",
                        String(userId)
                    );

                    localStorage.setItem(
                        "userName",
                        name
                    );

                    localStorage.setItem(
                        "userEmail",
                        email
                    );


                    /* =========================
                       APPLY DARK MODE
                    ========================= */

                    applyDarkMode(
                        darkMode
                    );


                    alert(
                        result &&
                        result.message
                            ? result.message
                            : "Settings saved successfully."
                    );


                } catch (error) {

                    console.error(
                        "Save settings error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Could not save settings."
                    );

                } finally {

                    saveBtn.disabled = false;

                    saveBtn.textContent =
                        originalText;
                }
            }
        );
    }


    /* =========================
       OPEN DELETE MODAL
    ========================= */

    if (deleteBtn && modal) {

        deleteBtn.addEventListener(
            "click",
            function () {

                modal.style.display =
                    "flex";
            }
        );
    }


    /* =========================
       CANCEL DELETE
    ========================= */

    if (cancelDelete && modal) {

        cancelDelete.addEventListener(
            "click",
            function () {

                modal.style.display =
                    "none";
            }
        );
    }


    /* =========================
       DELETE ACCOUNT
    ========================= */

    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            async function () {

                confirmDelete.disabled =
                    true;

                const originalText =
                    confirmDelete.textContent;

                confirmDelete.textContent =
                    "Deleting...";


                try {

                    const result =
                        await deleteAccount(
                            userId
                        );


                    alert(
                        result &&
                        result.message
                            ? result.message
                            : "Account deleted successfully."
                    );


                    /* =========================
                       CLEAR AUTH DATA
                    ========================= */

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "role"
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
                        "loggedIn"
                    );

                    localStorage.removeItem(
                        "userType"
                    );


                    /* =========================
                       GO HOME
                    ========================= */

                    window.location.href =
                        "index.html";


                } catch (error) {

                    console.error(
                        "Delete account error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Could not delete account."
                    );

                    confirmDelete.disabled =
                        false;

                    confirmDelete.textContent =
                        originalText;
                }
            }
        );
    }


    /* =========================
       CLOSE MODAL WHEN CLICKING
       OUTSIDE THE MODAL BOX
    ========================= */

    window.addEventListener(
        "click",
        function (event) {

            if (
                modal &&
                event.target === modal
            ) {

                modal.style.display =
                    "none";
            }
        }
    );


    /* =========================
       ESCAPE KEY CLOSES MODAL
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal
            ) {

                modal.style.display =
                    "none";
            }
        }
    );


    /* =========================
       INITIAL LOAD
    ========================= */

    loadSettings();

});