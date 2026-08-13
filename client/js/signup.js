const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput =
            document.getElementById("confirmPassword");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword =
            confirmPasswordInput.value.trim();

        /*
        ====================================================
        VALIDATION
        ====================================================
        */

        if (
            name === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (name.length < 2) {
            alert("Name must be at least 2 characters.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        /*
        ====================================================
        SEND REGISTRATION REQUEST
        ====================================================
        */

        try {

            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email.toLowerCase(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            /*
            ====================================================
            HANDLE SERVER ERROR
            ====================================================
            */

            if (!response.ok) {
                alert(
                    data.message ||
                    "Could not create account."
                );

                return;
            }

            /*
            ====================================================
            REGISTRATION SUCCESSFUL
            ====================================================
            */

            alert(
                "Account created successfully! Please login."
            );

            window.location.href = "login.html";

        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            alert(
                "Could not connect to the server. Please make sure the server is running."
            );
        }
    });
}