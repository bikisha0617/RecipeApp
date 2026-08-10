const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const modal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const notificationsInput = document.getElementById("notifications");
const darkModeInput = document.getElementById("darkMode");
const userId = localStorage.getItem("userId");

// Check login
if (!userId) {
    alert("Please log in first.");
    window.location.href = "login.html";
}

// Load user information
async function loadSettings() {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Could not load settings.");
            return;
        }

        // Fill inputs
        nameInput.value = data.name || "";
        emailInput.value = data.email || "";
        notificationsInput.checked = data.notifications === 1 || data.notifications === true;
        darkModeInput.checked = data.darkMode === 1 || data.darkMode === true;
    } catch (error) {
        console.error(error);
        alert("Could not connect to server.");
    }
}
loadSettings();

// Save settings
saveBtn.onclick = async function() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (name === "" || email === "") {
        alert("Please fill in your name and email.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    notifications: notificationsInput.checked,
                    darkMode: darkModeInput.checked
                })
            }
        );
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Could not save settings.");
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);

        alert("Settings saved!");
    } catch (error) {
        console.error(error);
        alert("Could not connect to server.");
    }
};

// Open delete popup
deleteBtn.onclick = function() {
    modal.style.display = "flex";
};

// Cancel delete
cancelDelete.onclick = function() {
    modal.style.display = "none";
};

// Delete account
confirmDelete.onclick = async function() {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`,
            {
                method: "DELETE"
            }
        );
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Could not delete account.");
            return;
        }
        
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        alert("Account deleted.");
        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        alert("Could not connect to server.");
    }
};

// Close modal when clicking outside
window.onclick = function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};