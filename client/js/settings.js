document.addEventListener("DOMContentLoaded", function () {
    const saveBtn =document.getElementById("saveBtn");
    const deleteBtn =document.getElementById("deleteBtn");
    const modal =document.getElementById("deleteModal");
    const cancelDelete =document.getElementById("cancelDelete");
    const confirmDelete =document.getElementById("confirmDelete");
    const nameInput =document.getElementById("name");
    const emailInput =document.getElementById("email");
    const passwordInput =document.getElementById("password");
    const notificationsInput =document.getElementById("notifications");
    const darkModeInput =document.getElementById("darkMode");
    const changePhotoBtn =document.getElementById("changePhoto");

    if (!isLoggedIn()) {
        alert("Please log in first.");
        window.location.href ="login.html";
        return;
    }

    const userId =getUserId();
    if (!userId) {
        logout();
        return;
    }

    function applyDarkMode(enabled) {
        document.body.classList.toggle("dark-mode",Boolean(enabled));
    }

    async function loadSettings() {
        try {
            const user =await getMyProfile();
            if (nameInput) {
                nameInput.value =user.name || "";
            }
            if (emailInput) {
                emailInput.value =user.email || "";
            }
            if (notificationsInput) {
                notificationsInput.checked =Boolean(user.notifications);
            }
            if (darkModeInput) {
                darkModeInput.checked =Boolean(user.darkMode);
                applyDarkMode(user.darkMode);
            }
            const storedUser =getCurrentUser() || {};
            storedUser.id =user.id || userId;
            storedUser.name =user.name || "";
            storedUser.email =user.email || "";
            localStorage.setItem("user",JSON.stringify(storedUser));
            localStorage.setItem("userId",String(user.id || userId));
            localStorage.setItem("userName",user.name || "");
            localStorage.setItem("userEmail",user.email || "");
        } catch (error) {
            console.error("Load settings error:",error);
            alert(error.message || "Could not load settings.");
        }
    }
    if (darkModeInput) {
        darkModeInput.addEventListener("change",
            function () {
                applyDarkMode(darkModeInput.checked);
            }
        );
    }
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener("click",
            function () {
                alert("Profile photo upload is not available yet.");
            }
        );
    }
    if (saveBtn) {
        saveBtn.addEventListener("click",
            async function () {
                const name =nameInput ? nameInput.value.trim() : "";
                const email =emailInput ? emailInput.value.trim() : "";
                const notifications =notificationsInput ? notificationsInput.checked : false;
                const darkMode =darkModeInput ? darkModeInput.checked : false;
                if (name.length < 2) {
                    alert("Name must be at least 2 characters.");
                    return;
                }
                if (!email) {
                    alert("Email is required.");
                    return;
                }

                /* Basic email validation */
                const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    alert("Please enter a valid email address.");
                    return;
                }
                saveBtn.disabled = true;
                const originalText =saveBtn.textContent;
                saveBtn.textContent ="Saving...";
                try {
                    const result =await updateProfile(userId,
                        {
                            name: name,
                            email: email,
                            notifications:notifications,
                            darkMode:darkMode
                        }
                    );
                    const updatedUser =result && result.user ? result.user : getCurrentUser() || {};
                    updatedUser.id =updatedUser.id || userId;
                    updatedUser.name =name;
                    updatedUser.email =email;
                    updatedUser.notifications =notifications;
                    updatedUser.darkMode =darkMode;
                    localStorage.setItem("user",JSON.stringify(updatedUser));
                    localStorage.setItem("userId",String(userId));
                    localStorage.setItem("userName",name);
                    localStorage.setItem("userEmail",email);
                    applyDarkMode(darkMode);
                    alert(result && result.message ? result.message : "Settings saved successfully.");
                } catch (error) {
                    console.error("Save settings error:",error);
                    alert(error.message || "Could not save settings.");
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.textContent =originalText;
                }
            }
        );
    }
    if (deleteBtn && modal) {
        deleteBtn.addEventListener("click",
            function () {
                modal.style.display ="flex";
            }
        );
    }
    if (cancelDelete && modal) {
        cancelDelete.addEventListener("click",
            function () {
                modal.style.display ="none";
            }
        );
    }

    /* Delete account */
    if (confirmDelete) {
        confirmDelete.addEventListener("click",
            async function () {
                confirmDelete.disabled =true;
                const originalText =confirmDelete.textContent;
                confirmDelete.textContent ="Deleting...";
                try {
                    const result =await deleteAccount(userId);
                    alert(result && result.message ? result.message : "Account deleted successfully.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("role");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("loggedIn");
                    localStorage.removeItem("userType");
                    window.location.href ="index.html";
                } catch (error) {
                    console.error("Delete account error:",error);
                    alert(error.message || "Could not delete account.");
                    confirmDelete.disabled =false;
                    confirmDelete.textContent =originalText;
                }
            }
        );
    }

    window.addEventListener("click",
        function (event) {
            if (modal && event.target === modal) {
                modal.style.display ="none";
            }
        }
    );

    document.addEventListener("keydown",
        function (event) {
            if (event.key === "Escape" && modal) {
                modal.style.display ="none";
            }
        }
    );
    loadSettings();
});