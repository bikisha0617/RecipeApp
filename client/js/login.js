const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed.");
            return;
        }

        // Save logged-in user information
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        // Go to home page
        window.location.href = "index.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Could not connect to server.");
    }
});