const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate fields
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.toLowerCase(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed.");
                return;
            }

            /*
            ====================================================
            SAVE AUTHENTICATION INFORMATION
            ====================================================
            */

            if (data.token) {
                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            if (data.user) {
                localStorage.setItem(
                    "loggedIn",
                    "true"
                );

                localStorage.setItem(
                    "userId",
                    String(data.user.id)
                );

                localStorage.setItem(
                    "userName",
                    data.user.name || ""
                );

                localStorage.setItem(
                    "userEmail",
                    data.user.email || ""
                );

                if (data.user.type) {
                    localStorage.setItem(
                        "userType",
                        data.user.type
                    );
                }
            }

            /*
            ====================================================
            LOGIN SUCCESS
            ====================================================
            */

            alert("Login successful!");

            window.location.href = "index.html";

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Could not connect to the server. Please make sure the server is running."
            );
        }
    });
}