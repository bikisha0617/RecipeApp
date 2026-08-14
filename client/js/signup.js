document.addEventListener("DOMContentLoaded", function () {
    const form =document.getElementById("signupForm");
    if (!form) {
        return;
    }
    const message =document.getElementById("signupMessage");
    form.addEventListener("submit",
        async function (event) {
            event.preventDefault();
            const nameInput =document.getElementById("name");
            const emailInput =document.getElementById("email");
            const passwordInput =document.getElementById("password");
            const confirmPasswordInput =document.getElementById("confirmPassword");
            const name =nameInput.value.trim();
            const email =emailInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            const confirmPassword =confirmPasswordInput ? confirmPasswordInput.value : password;

            if (name.length < 2) {
                showMessage("Name must be at least 2 characters.",true);
                return;
            }
            if (!email) {
                showMessage("Email is required.",true);
                return;
            }
            if (password.length < 6) {
                showMessage("Password must be at least 6 characters.",true);
                return;
            }
            if (password !== confirmPassword) {
                showMessage("Passwords do not match.",true);
                return;
            }
            try {
                const response =await fetch(API_BASE_URL +"/auth/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    }
                );
                const data =await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Registration failed.");
                }
                showMessage("Account created successfully. Redirecting...",false);
                setTimeout(function () {
                    window.location.href ="login.html";
                },800
            );
            } catch (error) {
                console.error("Signup error:",error);
                showMessage(error.message || "Could not create account.",true);
            }
        }
    );
    function showMessage(text, isError) {
        if (!message) {
            alert(text);
            return;
        }
        message.textContent = text;
        message.style.display = "block";
        if (isError) {
            message.classList.add("error");
        } else {
            message.classList.remove("error");
        }
    }
});